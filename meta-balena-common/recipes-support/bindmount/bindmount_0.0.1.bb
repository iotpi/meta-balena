# Auto-Generated by cargo-bitbake 0.3.9
#
inherit cargo

# If this is git based prefer versioned ones if they exist
# DEFAULT_PREFERENCE = "-1"

# how to get bindmount could be as easy as but default to a git checkout:
# SRC_URI += "crate://crates.io/bindmount/0.0.1"
SRC_URI += "git://git@github.com/balena-os/bindmount.git;protocol=ssh"
SRCREV = "f597fb026636f0f1be1fbfe2f5a8c2edee3c4493"
S = "${WORKDIR}/git"
CARGO_SRC_DIR=""
PV:append = ".AUTOINC+f597fb0266"

# please note if you have entries that do not begin with crate://
# you must change them to how that package can be fetched
# SRC_URI += " \
# crate://crates.io/errno/0.2.3 \
# crate://crates.io/kernel32-sys/0.2.2 \
# crate://crates.io/libc/0.2.36 \
# crate://crates.io/winapi-build/0.1.1 \
# crate://crates.io/winapi/0.2.8 \
# "

LIC_FILES_CHKSUM="file://LICENSE;md5=3bfd34238ccc26128aef96796a8bbf97"

SUMMARY = "This tools bind mounts a path to another path keeping the same filesystem structure of the TARGET in the SOURCE. As well it takes of care creating the SOURCE for the case where TARGET is a file or a directory"
HOMEPAGE = "https://github.com/resin-os/bindmount.git"
LICENSE = "Apache-2.0"

# includes this file if it exists but does not fail
# this is useful for anything you may want to override from
# what cargo-bitbake generates.
include bindmount-${PV}.inc
include bindmount.inc
