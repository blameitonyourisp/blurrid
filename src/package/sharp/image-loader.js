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
 * @file Methods to load and save images for use in dct compression.
 * @author James Reid
 */

// @ts-check

// @@imports-dependencies
import sharp from "sharp"

// @@imports-types
/* eslint-disable no-unused-vars -- Types only used in comments. */
import { BlurridDecoder } from "../dct/index.js"
/* eslint-enable no-unused-vars -- Close disable-enable pair. */

// @@body
/**
 * Load image from file, returning buffer of flat, 4-channel rgba pixel data,
 * and metadata pertaining to the image which is required for.
 *
 * @param {string} path - Relative path to image from point of execution.
 * @param {number} [samples=16] - Maximum dimension of downsized sample image in
 *      any direction. Note that, due to max uniform limits in webgl fragment
 *      shaders, sample sizes greater than 16 will prevent a blur from being
 *      created using the webgl canvas. In this case the web component will
 *      set the image loading to `eager`, or will use web workers as a fallback
 *      if available to render the blur.
 * @returns {Promise.<{buffer:Buffer, width:number, height:number}>} Data buffer
 *      and image metadata.
 */
const loadImage = async (path, samples = 16) => {
    // Load and resize image to fit largest dimension within sample size given.
    const sharpInstance = sharp(path)
    const buffer = await sharpInstance
        .ensureAlpha()
        .resize(samples, samples, { fit: "inside" })
        .raw()
        .toBuffer()
    const metadata = await sharpInstance.metadata()
    const { width, height } = { width: 0, height: 0, ...metadata }

    return { buffer, width, height }
}

/**
 * Save flat array of 3-channel rgb pixel data to image file.
 *
 * @param {BlurridDecoder} decoder - Image pixel data in flat array.
 * @param {string} path - Relative path of new image from point of execution.
 * @returns {Promise.<sharp.OutputInfo>} Sharp output details.
 */
const saveImage = (decoder, path) => {
    // Generate buffer from image data, and configure sharp instance options.
    const buffer = Buffer.from(decoder.toImageData())
    const { width, height } = decoder.metadata.image
    const options = /** @type {sharp.SharpOptions} */ ({
        raw: { width, height, channels: 4 }
    })

    return sharp(buffer, options).toFile(path)
}

// @@exports
export { loadImage, saveImage }
