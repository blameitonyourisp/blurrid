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
 * @file Methods for decoding dct to dataUrl, and for upsizing decoded images.
 * @author James Reid
 */

// @ts-check

// @@imports-module
import { getCanvasWebGL, getCanvas2D } from "./canvas.js"

// @@imports-types
/* eslint-disable no-unused-vars -- Types only used in comments. */
import { BlurridDecoder, BlurridMetadata } from "../dct/index.js"
/* eslint-enable no-unused-vars -- Close disable-enable pair. */

// @@body
/**
 *
 * @param {BlurridDecoder} decoder
 * @returns {string}
 */
const getDataUrl = decoder => {
    const { metadata, coefficients } = decoder
    const { canvas, context, program } = getCanvasWebGL(metadata)

    /** @type {Object.<string,{type:string, data:any}>} */
    const uniforms = {
        "u_color": { type: "uniform4fv", data: [1, 0, 0, 1] },
        "u_image_width": { type: "uniform1f", data: metadata.image.width },
        "u_image_height": { type: "uniform1f", data: metadata.image.height },
        "u_lumaDct": {
            type: "uniform1fv",
            data: normalizeDctSamples(coefficients.luma, metadata)
        },
        "u_chromaBlueDct": {
            type: "uniform1fv",
            data: normalizeDctSamples(coefficients.chromaBlue, metadata)
        },
        "u_chromaRedDct": {
            type: "uniform1fv",
            data: normalizeDctSamples(coefficients.chromaRed, metadata)
        }
    }

    for (const key in uniforms) {
        const location = context.getUniformLocation(program, key)
        // @ts-expect-error - String *can* index WebGLUniformLocation
        context[uniforms[key].type](location, uniforms[key].data)
    }

    const drawData = {
        primitiveType: context.TRIANGLES,
        offset: 0,
        count: 6
    }

    const { primitiveType, offset, count } = drawData
    context.drawArrays(primitiveType, offset, count)

    return canvas.toDataURL()
}

/**
 *
 * @param {number[][]} array2D
 * @param {BlurridMetadata} metadata
 * @returns
 */
const normalizeDctSamples = (array2D, metadata) => {
    const length = /** @type {number} */ (metadata.sample.max)

    return Array.from({ length: length ** 2 }, (_, index) => {
        return array2D.flatMap(array1D => {
            return Array.from({ length }, (_, index) => array1D[index] || 0)
        })[index] || 0
    })
}

/**
 *
 * @param {object} target
 * @param {HTMLCanvasElement} target.canvas
 * @param {CanvasRenderingContext2D} target.context
 * @param {ImageData} imageData
 * @param {BlurridDecoder} decoder
 * @returns {Promise.<string>}
 */
const upsizeImageData = (target, imageData, decoder) => {
    return new Promise(resolve => {
        const image = document.createElement("img")

        const listener = () => {
            const { width, height } = target.canvas
            target.context.drawImage(image, 0, 0, width, height)

            image.removeEventListener("load", listener)
            image.remove()

            resolve(target.canvas.toDataURL())
        }

        image.addEventListener("load", listener)

        decoder.metadata.resize(imageData.width)
        const { canvas, context } = getCanvas2D(decoder.metadata)
        context.putImageData(imageData, 0, 0)
        image.src = canvas.toDataURL()
    })
}

// @@exports
export { getDataUrl, upsizeImageData }
