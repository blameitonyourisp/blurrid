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
 *
 * @param {string} path
 * @param {number} size
 * @returns {Promise.<{image:Buffer, metadata:sharp.Metadata}>}
 */
const loadImage = async (path, size) => {
    const sharpInstance = await sharp(path)
    const image = await sharpInstance
        .ensureAlpha()
        .resize(size, size, { fit: "inside" })
        .raw()
        .toBuffer()
    const metadata = await sharpInstance.metadata()

    return { image, metadata }
}

/**
 *
 * @param {number[]} data
 * @param {string} path
 * @param {number} width
 * @param {number} height
 * @param {number} channels
 * @returns {Promise.<sharp.OutputInfo>}
 */
const saveImage = (data, path, width, height, channels = 4) => {
    const buffer = Buffer.from(data)
    const options = /** @type {sharp.SharpOptions} */ ({
        raw: { width, height, channels }
    })

    return sharp(buffer, options).toFile(path)
}

// @@exports
export { loadImage, saveImage }
