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
 * @file Wrapper class around blurrid dct encoding functions.
 * @author James Reid
 */

// @ts-check

// @@imports-module
import { expandSample } from "./array-conversions.js"
import { BlurridMetadata } from "./BlurridMetadata.js"
import { rgbaBufferToYCbCrArray } from "./colorspace-conversions.js"
import { consumeDctArray3D } from "./consumers.js"
import { encodePixelArray3D } from "./encode.js"
import { BUFFER_LOCATIONS } from "./serialize.js"
import { SubsampleSelector } from "./SubsampleSelector.js"

// @@imports-utils
import { BitBuffer } from "../utils/index.js"

// @@body
class BlurridEncoder {
    #metadata
    #buffer

    /**
     *
     * @param {object} obj
     * @param {Buffer} obj.buffer
     * @param {number} obj.width
     * @param {number} obj.height
     */
    constructor({ buffer, width, height }) {
        const ratio = Math.min(width, height) / Math.max(width, height)
        const samples = Math.round(Math.sqrt(buffer.length / (4 * ratio)))

        const secondarySamples = buffer.length / 4 / samples
        const { sampleWidth, sampleHeight } = width > height
            ? { sampleWidth: samples, sampleHeight: secondarySamples }
            : { sampleWidth: secondarySamples, sampleHeight: samples }

        const image = { width, height }
        const sample = { width: sampleWidth, height: sampleHeight }
        this.#metadata = new BlurridMetadata({ image, sample })
        this.#buffer = buffer
    }

    toString({ length = 64, subsampling = "4:2:2" } = {}) {
        //
        const buffer = new BitBuffer({ length })
        const subsampleSelector = new SubsampleSelector(subsampling)

        //
        this.#serializeMetadata(buffer)
        this.#serializeSubsampling(buffer, subsampleSelector)
        this.#serializeCoefficients(buffer, subsampleSelector)

        return buffer.toString()
    }

    /**
     *
     * @param {BitBuffer} buffer
     */
    #serializeMetadata(buffer) {
        //
        buffer.writePointer = BUFFER_LOCATIONS.METADATA

        //
        buffer.write(this.#metadata.image.width, { size: 16 })
        buffer.write(this.#metadata.image.height, { size: 16 })
        buffer.write(this.#metadata.sample.width, { size: 8 })
        buffer.write(this.#metadata.sample.height, { size: 8 })
    }

    /**
     *
     * @param {BitBuffer} buffer
     * @param {SubsampleSelector} subsampleSelector
     */
    #serializeSubsampling(buffer, subsampleSelector) {
        //
        buffer.writePointer = BUFFER_LOCATIONS.SUBSAMPLING

        buffer.write(subsampleSelector.luma, { size: 3 })
        buffer.write(subsampleSelector.chromaBlue, { size: 3 })
        buffer.write(subsampleSelector.chromaRed, { size: 3 })
    }

    /**
     *
     * @param {BitBuffer} buffer
     * @param {SubsampleSelector} subsampleSelector
     */
    #serializeCoefficients(buffer, subsampleSelector) {
        //
        buffer.writePointer = BUFFER_LOCATIONS.COEFFICIENTS
        buffer.lastWriteSize = BUFFER_LOCATIONS.ASSUMED_COEFFICIENT_SIZE
        for (const coefficient of this.#dctConsumer(subsampleSelector)) {
            const written = buffer.writeRelative(coefficient, { signed: true })
            if (isNaN(written)) { break }
        }
    }

    /**
     *
     * @param {SubsampleSelector} subsampleSelector
     * @returns
     */
    #dctConsumer(subsampleSelector) {
        const yCbCrArray = rgbaBufferToYCbCrArray(this.#buffer)
        const array3D = expandSample(yCbCrArray, this.#metadata.sample.width)

        return consumeDctArray3D(encodePixelArray3D(array3D), subsampleSelector)
    }
}

// @@exports
export { BlurridEncoder }
