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
 * @file Generator for consuming arrays of dct coefficients.
 * @author James Reid
 */

// @ts-check

// @@imports-utils
import { DecoratedError } from "../utils/index.js"

// @@imports-types
/* eslint-disable no-unused-vars -- Types only used in comments. */
import { SubsampleSelector } from "./SubsampleSelector.js"
/* eslint-enable no-unused-vars -- Close disable-enable pair. */

// @@body
/**
 *
 * @param {number[][][]} array3D
 * @param {SubsampleSelector} subsampleSelector
 */
function* consumeDctArray3D(array3D, subsampleSelector) {
    const [lumaArray2D, chromaBlueArray2D, chromaRedArray2D] = array3D
    const consumers = {
        luma: consumeDctArray2D(lumaArray2D),
        chromaBlue: consumeDctArray2D(chromaBlueArray2D),
        chromaRed: consumeDctArray2D(chromaRedArray2D)
    }

    let index = 0
    do {
        const iteration = consumers[subsampleSelector.key(index)].next()
        if (iteration.done) { break }
        yield iteration.value
    } while (++index)
}

// consume 2d array from diagonal
/**
 *
 * @param {number[][]} array2D - 2D array of dct coefficients (the 2D array will
 *      be one subsample
 *      from luma, or each chrominance).
 */
function* consumeDctArray2D(array2D) {
    const [width, height] = [array2D[0].length, array2D.length]
    for (const coefficientRow of array2D) {
        if (coefficientRow.length !== width) {
            throw new DecoratedError({
                name: "DctError",
                message: "Coefficient row width does not match image width",
                "image-width": length,
                "row-width": coefficientRow.length
            })
        }
    }
    let [x, y] = [0, 0]

    while (true) {
        yield array2D[y][x]

        if (y === 0 || x === width - 1) {
            const sum = x + y + 1
            if (sum > width + height - 2) { break }
            y = x >= height - 1 ? height - 1 : x + 1
            x = sum - y
        }
        else { y--; x++ }
    }
}

// @@exports
export { consumeDctArray3D }
