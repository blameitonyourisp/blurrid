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
 * @file Wrapper class around blurrid dct decoding functions.
 * @author James Reid
 */

// @ts-check

// @@imports-module
import { collapseSample } from "./array-conversions.js"
import { BlurridMetadata } from "./BlurridMetadata.js"
import { buildDctArray3D } from "./builders.js"
import { yCbCrArrayToRgbaArray } from "./colorspace-conversions.js"
import { decodePixelArray3D } from "./decode.js"
import { BUFFER_LOCATIONS } from "./serialize.js"
import { SubsampleSelector } from "./SubsampleSelector.js"

// @@imports-utils
import { BitBuffer, DecoratedError } from "../utils/index.js"

// @@body
class BlurridDecoder {
    #serializedDct
    #buffer
    #metadata
    #coefficients

    /**
     *
     * @param {string} serializedDct
     */
    constructor(serializedDct) {
        // absolute minimum 10
        if (!serializedDct.match(/^[A-Za-z0-9\-_]{16,}$/)) {
            throw new DecoratedError({
                name: "BlurridDecoderError",
                message: "String minimum 16 url-safe base 64 encoded chars",
                "serialized-dct": serializedDct
            })
        }

        this.#serializedDct = serializedDct
        this.#buffer = BitBuffer.from(serializedDct)
        this.#metadata = new BlurridMetadata(this.#deserializeMetadata())
        this.#coefficients = this.#deserializeCoefficients()
    }

    toImageData() {
        const { luma, chromaBlue, chromaRed } = this.#coefficients
        const array3D = [luma, chromaBlue, chromaRed]

        return yCbCrArrayToRgbaArray(
            collapseSample(decodePixelArray3D(array3D, this.#metadata))
        )
    }

    #deserializeMetadata() {
        //
        this.#buffer.readPointer = BUFFER_LOCATIONS.METADATA
        //
        const image = {
            width: this.#buffer.read(16),
            height: this.#buffer.read(16)
        }
        const sample = {
            width: this.#buffer.read(8),
            height: this.#buffer.read(8)
        }

        return { image, sample }
    }

    #deserializeSubsampling() {
        //
        this.#buffer.readPointer = BUFFER_LOCATIONS.SUBSAMPLING

        const luma = this.#buffer.read(3)
        const chromaBlue = this.#buffer.read(3)
        const chromaRed = this.#buffer.read(3)

        return new SubsampleSelector(`${luma}:${chromaBlue}:${chromaRed}`)
    }

    #deserializeCoefficients() {
        const dctBuilder = this.#dctBuilder()
        let [luma, chromaBlue, chromaRed] = /** @type {number[][][]} */
            (dctBuilder.next().value)

        //
        this.#buffer.readPointer = BUFFER_LOCATIONS.COEFFICIENTS
        this.#buffer.lastReadSize = BUFFER_LOCATIONS.ASSUMED_COEFFICIENT_SIZE

        /* eslint-disable-next-line no-constant-condition -- break from in while
        loop ends loop. */
        while (true) {
            const coefficient = this.#buffer.readRelative({ signed: true })
            if (isNaN(coefficient)) { break }

            // check if done, and break
            [luma, chromaBlue, chromaRed] = /** @type {number[][][]} */
                (dctBuilder.next(coefficient).value)
        }

        return { luma, chromaBlue, chromaRed }
    }

    #dctBuilder() {
        //
        return buildDctArray3D(
            this.#metadata.sample.width,
            this.#metadata.sample.height,
            this.#deserializeSubsampling()
        )
    }

    get serializedDct() { return this.#serializedDct }

    get metadata() { return this.#metadata }

    get coefficients() { return this.#coefficients }
}

// @@exports
export { BlurridDecoder }
