/**
 * Convert rgb (red, green, blue) color value to YCbCr (luma, chroma blue,
 * chroma red) color value for use in jpg dct compression. Please see [this
 * section](https://en.wikipedia.org/wiki/YCbCr#JPEG_conversion) of the
 * wikipedia page for the YCbCr colorspace for more information on the specific
 * values used in this conversion.
 *
 * @param {number} red - Red value of color between 0 and 255.
 * @param {number} green - Green value of color between 0 and 255.
 * @param {number} blue - Blue value of color between 0 and 255.
 * @returns {{luma:number, chromaBlue:number, chromaRed:number}} Color converted
 *      to YCbCr.
 */
export function rgbToYCbCr(red: number, green: number, blue: number): {
    luma: number;
    chromaBlue: number;
    chromaRed: number;
};
/**
 * Convert 4-channel rgba (red, green, blue, alpha) buffer into a 3-channel
 * YCbCr (luma, chroma blue, chroma red) flat data array.
 *
 * @param {Buffer} rgbaBuffer - 4-channel, rgba formatted buffer.
 * @returns 3-channel, YCbCr formatted flat data array.
 */
export function rgbaBufferToYCbCrArray(rgbaBuffer: Buffer): number[];
/**
 * Convert YCbCr (luma, chroma blue, chroma red) color value to rgb (red, green,
 * blue) color value for use in reversing colorspace used in jpg dct. Please see
 * [this section](https://en.wikipedia.org/wiki/YCbCr#JPEG_conversion) of the
 * wikipedia page for the YCbCr colorspace for more information on the specific
 * values used in this conversion.
 *
 * @param {number} luma - Luma value of color between 0 and 255.
 * @param {number} chromaBlue - Chroma blue value of color between 0 and 255.
 * @param {number} chromaRed - Chroma red value of color between 0 and 255.
 * @returns {{red:number, green:number, blue:number}} Color converted to rgb.
 */
export function yCbCrToRgb(luma: number, chromaBlue: number, chromaRed: number): {
    red: number;
    green: number;
    blue: number;
};
/**
 * Convert 3-channel YCbCr (luma, chroma blue, chroma red) flat data array into
 * 4-channel rgba (red, green, blue, alpha) flat data array.
 *
 * @param {number[]} yCbCrArray - 3-channel, YCbCr formatted flat data array.
 * @returns 4-channel, rgba formatted flat data array.
 */
export function yCbCrArrayToRgbaArray(yCbCrArray: number[], alpha?: number): number[];
