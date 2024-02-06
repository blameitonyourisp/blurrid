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
 * @file Class for building and accessing dct metadata.
 * @author James Reid
 */

// @ts-check

// @@no-imports

// @@body
class BlurridMetadata {
    #image
    #sample

    /**
     *
     * @param {object} obj
     * @param {object} obj.image
     * @param {number} obj.image.width
     * @param {number} obj.image.height
     * @param {object} obj.sample
     * @param {number} obj.sample.width
     * @param {number} obj.sample.height
     */
    constructor({ image, sample }) {
        this.#image = image
        this.#sample = { ...sample, max: Math.max(sample.width, sample.height) }
    }

    /**
     *
     * @param {number} width
     */
    resize(width) {
        this.#image.height = Math
            .round(this.#image.height * width / this.#image.width)
        this.#image.width = width
    }

    get image() { return this.#image }

    get sample() { return this.#sample }
}

// @@exports
export { BlurridMetadata }
