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
 * @file Generators for building arrays of dct coefficients.
 * @author James Reid
 */

// @ts-check

// @@imports-types
/* eslint-disable no-unused-vars -- Types only used in comments. */
import { SubsampleSelector } from "./SubsampleSelector.js"
/* eslint-enable no-unused-vars -- Close disable-enable pair. */

// @@body
// build dct coefficients
/**
 *
 * @param {number} width
 * @param {number} height
 * @param {SubsampleSelector} subsampleSelector
 */
function* buildDctArray3D(width, height, subsampleSelector) {
    const builders = {
        luma: buildDctArray2D(width, height),
        chromaBlue: buildDctArray2D(width, height),
        chromaRed: buildDctArray2D(width, height)
    }
    const array3D = [
        builders.luma.next().value,
        builders.chromaBlue.next().value,
        builders.chromaRed.next().value,
    ]

    let index = 0
    do {
        const value = /** @type {number} */ (yield array3D)
        const key = subsampleSelector.key(index)

        const iteration = builders[key].next(value)
        if (iteration.done) { break }
        key === "luma" ? array3D[0] = iteration.value
            : key === "chromaBlue" ? array3D[1] = iteration.value
            : array3D[2] = iteration.value
    } while (++index)
}

// build 2d array from diagonal
/**
 *
 * @param {number} width
 * @param {number} height
 */
function* buildDctArray2D(width, height) {
    // /** @type {number[][]} */
    // const array2D = Array.from(
    //     Array.from({ length: height }),
    //     () => Array.from({ length: width }).fill(0)
    // )
    const array2D = Array.from(
        Array.from({ length: width }),
        () => Array.from({ length: height }).fill(0)
    )
    let [x, y] = [0, 0]

    while (true) {
        // array2D[y][x] = /** @type {number} */ (yield array2D)
        array2D[x][y] = /** @type {number} */ (yield array2D)

        if (y === 0 || x === width - 1) {
            const sum = x + y + 1
            if (sum > width + height - 1) { break }
            y = x >= height - 1 ? height - 1 : x + 1
            x = sum - y
        }
        else { y--; x++ }
    }
}

// @@exports
export { buildDctArray3D }
