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
 * @file Methods for decoding pixel arrays using dct compression algorithm.
 * @author James Reid
 */

// @ts-check

// @@imports-types
/* eslint-disable no-unused-vars -- Types only used in comments. */
import { BlurridMetadata } from "./BlurridMetadata.js"
/* eslint-enable no-unused-vars -- Close disable-enable pair. */

// @@body
/**
 *
 * @param {number[][][]} array3D
 * @param {BlurridMetadata} metadata
 * @returns {number[][][]}
 */
const decodePixelArray3D = (array3D, metadata) => {
    const [lumaDct, chromaBlueDct, chromaRedDct] = array3D

    const emptyChannel = () => {
        return Array.from(
            Array.from({ length: metadata.image.height }),
            () => Array.from({ length: metadata.image.width }).fill(0)
        )
    }

    const channels = [emptyChannel(), emptyChannel(), emptyChannel()]
    const [lumaChannel, chromaBlueChannel, chromaRedChannel] = channels

    for (let y = 0; y < metadata.image.height; y++) {
        for (let x = 0; x < metadata.image.width; x++) {
            const point = {
                x: x / metadata.image.width * metadata.sample.width,
                y: y / metadata.image.height * metadata.sample.height
            }

            lumaChannel[y][x] = decodePixelArray2D(lumaDct, point, metadata)
            chromaBlueChannel[y][x] =
                decodePixelArray2D(chromaBlueDct, point, metadata)
            chromaRedChannel[y][x] =
                decodePixelArray2D(chromaRedDct, point, metadata)
        }
    }

    return channels
}

/**
 *
 * @param {number[][]} array2D
 * @param {{x:number, y:number}} point
 * @param {BlurridMetadata} metadata
 * @returns
 */
const decodePixelArray2D = (array2D, point, metadata) => {
    const dctRow = []

    for (let i = 0; i < metadata.sample.width; i++) {
        const dctColumn = array2D[i]
        dctRow.push(decodePixelArray1D(dctColumn, point.y))
    }

    return decodePixelArray1D(dctRow, point.x)
}

// note in this implementation radians is always supplied +ve
/**
 *
 * @param {number} radians - Angle value in radians, note that in this
 *      implementation the angle is *always* provided as a positive value.
 * @returns {number}
 */
const fastCos = radians => {
    // Rectify angle value to between 0 and 2PI radians using custom mod (while
    // loop faster than builtin javascript `%` mod operator)
    while (radians >= Math.PI * 2) { radians -= Math.PI * 2 }

    // Rectify angle value to between 0 and PI radians (note that since angle
    // value is *always* supplied as a positive value in this implementation,
    // rectifying to a positive value is not required).
    if (radians > Math.PI) { radians = 2 * Math.PI - radians }

    // Execute fastCos formula using a rearranged Bhaskara sine approximation
    // (see here for more https://en.wikipedia.org/wiki/Bh%C4%81skara_I%27s_sine_approximation_formula) @no-wrap
    if (radians > Math.PI / 2) {
        radians = (radians - Math.PI) * (radians - Math.PI)
        return 5 * radians / (radians + Math.PI * Math.PI) - 1
    }
    radians *= radians
    return 1 - 5 * radians / (radians + Math.PI * Math.PI)
}

/**
 *
 * @param {number[]} array1D
 * @param {number} pointX
 * @returns {number}
 */
const decodePixelArray1D = (array1D, pointX) => {
    let result = 0
    for (let i = 0; i < array1D.length; i++) {
        let partial = array1D[i] * fastCos(
            ((2 * pointX + 1) * Math.PI * i) / (2 * array1D.length)
        )
        partial *= i === 0 ? Math.SQRT1_2 : 1
        result += partial
    }
    result *= Math.sqrt(2 / array1D.length)
    result = Math.round(result)
    return result
}

// @@exports
export { decodePixelArray3D }
