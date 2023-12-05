// Copyright (c) 2023 James Reid. All rights reserved.
//
// This source code file is licensed under the terms of the MIT license, a copy
// of which may be found in the LICENSE.md file in the root of this repository.
//
// For a template copy of the license see one of the following 3rd party sites:
//      - <https://opensource.org/licenses/MIT>
//      - <https://choosealicense.com/licenses/mit>
//      - <https://spdx.org/licenses/MIT>

/**
 * @file Methods to load and save images for use in dct compression.
 * @author James Reid
 */

// @ts-check

// @@imports-dependencies
import sharp from "sharp"

// @@body
/**
 * Load image from file, returning buffer of flat, 3-channel rgb pixel data, and
 * metadata pertaining to the image.
 *
 * @param {string} path - Relative path to image from point of execution.
 * @param {number} size - Maximum dimension of image in any direction.
 * @returns {Promise.<{image:Buffer, metadata:sharp.Metadata}>} Data buffer and
 *      image metadata.
 */
const loadImage = async (path, size) => {
    // Load and resize image to fit largest dimension within size given.
    const sharpInstance = sharp(path)
    const image = await sharpInstance
        .removeAlpha()
        .resize(size, size, { fit: "inside" })
        .raw()
        .toBuffer()
    const metadata = await sharpInstance.metadata()

    return { image, metadata }
}

/**
 * Save flat array of 3-channel rgb pixel data to image file.
 *
 * @param {number[]} data - Image pixel data in flat array.
 * @param {string} path - Relative path of new image from point of execution.
 * @param {number} width - Width of destination image.
 * @param {number} height - Height of destination image.
 * @param {object} obj - Configuration object of optional arguments.
 * @param {number} [obj.channels] - Number of channels in output image.
 * @returns {Promise.<sharp.OutputInfo>} Sharp output details.
 */
const saveImage = (data, path, width, height, { channels = 3 } = {}) => {
    // Generate buffer from image data, and configure sharp instance options.
    const buffer = Buffer.from(data)
    const options = /** @type {sharp.SharpOptions} */ ({
        raw: { width, height, channels }
    })

    return sharp(buffer, options).toFile(path)
}

// @@exports
export { loadImage, saveImage }
