// Copyright (c) 2024 James Reid. All rights reserved.
//
// This source code file is licensed under the terms of the MIT license, a copy
// of which may be found in the LICENSE.md file in the root of this repository.
//
// For a template copy of the license see one of the following 3rd party sites:
//      - <https://opensource.org/licenses/MIT>
//      - <https://choosealicense.com/licenses/mit>
//      - <https://spdx.org/licenses/MIT>

/**
 * @file Colorspace conversions for jpg dct compression algorithm.
 * @author James Reid
 */

// @ts-check

// @@no-imports

// @@body
/**
 * Clamp and optionally round input number between a minimum and maximum value.
 *
 * @param {number} number - Input number.
 * @param {number} minimum - Minimum value which will be returned.
 * @param {number} maximum - Maximum value which will be returned.
 * @param {boolean} isInt - Should returned value be an integer?
 * @returns {number} Clamped value.
 */
const clamp = (number, minimum = 0, maximum = 255, isInt = true) => {
    // If should return integer, round arguments whilst respecting maximum and
    // minimum sense of bounds (i.e. do not round minimum down or maximum up
    // which allows numbers to be returned outside of clamp bounds).
    if (isInt) {
        number = Math.round(number)
        minimum = Math.ceil(minimum)
        maximum = Math.floor(maximum)
    }

    // Return clamped number.
    return Math.max(minimum, Math.min(maximum, number))
}

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
const rgbToYCbCr = (red, green, blue) => {
    // Clamp input channels to values between 0 and 255.
    red = clamp(red)
    green = clamp(green)
    blue = clamp(blue)

    // Return converted colorspace values using coefficients rounded to 2dp.
    return {
        luma: clamp(0.30 * red + 0.59 * green + 0.11 * blue),
        chromaBlue: clamp(128 - 0.17 * red - 0.33 * green + 0.50 * blue),
        chromaRed: clamp(128 + 0.50 * red - 0.42 * green - 0.08 * blue)
    }
}

/**
 * Convert 4-channel rgba (red, green, blue, alpha) buffer into a 3-channel
 * YCbCr (luma, chroma blue, chroma red) flat data array.
 *
 * @param {Buffer} rgbaBuffer - 4-channel, rgba formatted buffer.
 * @returns 3-channel, YCbCr formatted flat data array.
 */
const rgbaBufferToYCbCrArray = rgbaBuffer => {
    // Initialise flat output data array.
    const yCbCrArray = []

    // Loop over input data array, fetching the luma, chroma blue, and chroma
    // red values from the red, green, and blue input data values. Skip alpha
    // channel, and push converted pixel data to the output array.
    for (let i = 0; i < rgbaBuffer.length; i += 4) {
        const { luma, chromaBlue, chromaRed } = rgbToYCbCr(
            rgbaBuffer[i],
            rgbaBuffer[i + 1],
            rgbaBuffer[i + 2]
        )
        yCbCrArray.push(luma, chromaBlue, chromaRed)
    }

    return yCbCrArray
}

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
const yCbCrToRgb = (luma, chromaBlue, chromaRed) => {
    // Clamp input channels to values between 0 and 255.
    luma = clamp(luma)
    chromaBlue = clamp(chromaBlue)
    chromaRed = clamp(chromaRed)

    // Rectify chroma values such that they are between -128 and +128.
    chromaBlue -= 128
    chromaRed -= 128

    // Return converted colorspace values using coefficients rounded to 2dp.
    return {
        red: clamp(luma + 1.40 * chromaRed),
        green: clamp(luma - 0.34 * chromaBlue - 0.71 * chromaRed),
        blue: clamp(luma + 1.77 * chromaBlue)
    }
}

/**
 * Convert 3-channel YCbCr (luma, chroma blue, chroma red) flat data array into
 * 4-channel rgba (red, green, blue, alpha) flat data array.
 *
 * @param {number[]} yCbCrArray - 3-channel, YCbCr formatted flat data array.
 * @returns 4-channel, rgba formatted flat data array.
 */
const yCbCrArrayToRgbaArray = (yCbCrArray, alpha = 255) => {
    // Initialise flat output data array.
    const rgbaArray = []

    // Loop over input data array, fetching the red, green, and blue values from
    // the luma, chroma blue, and chroma red input data values. Push converted
    // pixel data to the output array with extra alpha channel.
    for (let i = 0; i < yCbCrArray.length; i += 3) {
        const { red, green, blue } = yCbCrToRgb(
            yCbCrArray[i],
            yCbCrArray[i + 1],
            yCbCrArray[i + 2]
        )
        rgbaArray.push(red, green, blue, alpha)
    }

    return rgbaArray
}

// @@exports
export { rgbToYCbCr, rgbaBufferToYCbCrArray, yCbCrToRgb, yCbCrArrayToRgbaArray }
