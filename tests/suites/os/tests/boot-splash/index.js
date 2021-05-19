/*
 * Copyright 2019 balena
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('fs-extra');
const { decode } = require('jpeg-js');

const BOOT_SPLASH = `${__dirname}/assets/boot-splash.jpg`;

module.exports = {
	title: 'Balena boot splash tests',
	deviceType: {
		type: 'object',
		required: ['data'],
		properties: {
			data: {
				type: 'object',
				required: ['hdmi'],
				properties: {
					hdmi: {
						type: 'boolean',
						const: true,
					},
				},
			},
		},
	},
	tests: [
		{
			title: 'Reboot test',
			run: async function(test) {
				const { hammingDistance, blockhash } = this.require('/common/graphics');

				test.comment(`Calculating reference hash`)
				// Pull in the reference image
				const referenceHash = await new Promise((resolve, reject) => {
					const stream = fs.createReadStream(BOOT_SPLASH);
					const buffer = [];

					stream.on('error', reject);
					stream.on('data', data => {
						buffer.push(data);
					});
					stream.on('end', () => {
						resolve(blockhash(decode(Buffer.concat(buffer))));
					});
				});
				test.comment("Finished calculating reference hash")

				test.comment("Starting capture")
				await this.context.get().worker.capture('start');

				test.comment("Rebooting")
				// Start reboot check
				await this.context
					.get()
					.worker.executeCommandInHostOS(
						'touch /tmp/reboot-check',
						this.context.get().link,
					);
				await this.context
					.get()
					.worker.executeCommandInHostOS(
						'systemd-run --on-active=2 /sbin/reboot',
						this.context.get().link,
					);
				await this.context.get().utils.waitUntil(async () => {
					return (
						(await this.context
							.get()
							.worker.executeCommandInHostOS(
								'[[ ! -f /tmp/reboot-check ]] && echo "pass"',
								this.context.get().link,
							)) === 'pass'
					);
				}, false);

				test.comment(`Rebooted, device back online`)
				test.comment(`Stopping capture...`);
				const res = this.context.get().worker.capture('stop');
				res.on('error', error => {
					throw new Error("Error stopping capture")
				});

				res.on('ok', () => {
					test.comment(`Capture Stopped!`)
				});

				// captured frames are stored in /data/capture - we probably want a way to remove the need for a hard coded reference here
				const captured = fs.readdirSync(`/data/capture`)
			
				let pass = false
				test.comment(`Comparing captured images to reference image...`)
				for(let image of captured.reverse()){
					const capturedHash = await new Promise((resolve, reject) => {
						const stream = fs.createReadStream(`/data/capture/` + image);
						const buffer = [];
	
						stream.on('error', reject);
						stream.on('data', data => {
							buffer.push(data);
						});
						stream.on('end', () => {
							resolve(blockhash(decode(Buffer.concat(buffer))));
						});
					});

					let testDistance = hammingDistance(referenceHash, capturedHash)
					if(testDistance < 20){
						test.comment(`Found match, image ${image}, hamming distance from reference: ${testDistance}`)
						pass = true
						break
					}
				}

				test.comment(`Storing captured frames...`)
				await this.archiver.add(`/data/capture`);
				test.comment(`Frames stored`)
				
				test.true(
					pass,
					'Boot splash screen detected over HDMI interface',
				);				
			},
		},
	],
};