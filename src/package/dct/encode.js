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
 * @file Methods for encoding pixel arrays using dct compression algorithm.
 * @author James Reid
 */

// @ts-check

// @@no-imports

// @@body
/**
 *
 * @param {number[][][]} array3D
 * @returns {number[][][]}
 */
const encodePixelArray3D = array3D => {
    return array3D.map(encodePixelArray2D)
}

/**
 * add errors for inconsistent widths
 *
 * @param {number[][]} array2D
 * @returns {number[][]}
 */
const encodePixelArray2D = array2D => {
    /** @type {number[][]} */
    const primaryEncodedArray2D = []
    for (let i = 0; i < array2D.length; i++) {
        primaryEncodedArray2D.push(encodePixelArray1D(array2D[i]))
    }

    /** @type {number[][]} */
    const secondaryEncodedArray2D = Array.from(
        Array.from({ length: primaryEncodedArray2D.length }),
        () => []
    )
    for (let i = 0; i < primaryEncodedArray2D[0].length; i++) {
        const column = []
        for (let j = 0; j < primaryEncodedArray2D.length; j++) {
            column.push(primaryEncodedArray2D[j][i])
        }
        for (const [j, coefficient] of encodePixelArray1D(column).entries()) {
            secondaryEncodedArray2D[j].push(coefficient)
        }
    }

    return secondaryEncodedArray2D
}

/**
 *
 * @param {number[]} array1D
 * @returns {number[]}
 */
const encodePixelArray1D = array1D => {
    const coefficients = []
    for (let i = 0; i < array1D.length; i++) {
        let coefficient = 0
        for (let j = 0; j < array1D.length; j++) {
            coefficient += array1D[j] * Math.cos(
                ((2 * j + 1) * Math.PI * i) / (2 * array1D.length)
            )
        }
        coefficient *= Math.sqrt(2 / array1D.length)
        coefficient *= i === 0 ? Math.sqrt(0.5) : 1
        coefficients.push(Math.round(coefficient))
    }
    return coefficients
}

// @@exports
export { encodePixelArray3D }
