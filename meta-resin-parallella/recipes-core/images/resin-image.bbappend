IMAGE_FSTYPES_parallella-hdmi-resin = "resin-sdcard"

SDIMG_KERNELIMAGE_parallella-hdmi-resin = "uImage"

BOOT_SPACE_parallella-hdmi-resin = "40480"

# Customize resin-sdcard
RESIN_IMAGE_BOOTLOADER_parallella-hdmi-resin = ""
RESIN_BOOT_PARTITION_FILES_parallella-hdmi-resin = " \
    ${SDIMG_KERNELIMAGE} \
    device-trees/: \
    device-trees/parallella-mmc-boot.dtb:devicetree.dtb \
    bitstreams/: \
    bitstreams/parallella_e16_headless_gpiose_7010.bit.bin:parallella.bit.bin \
    "
