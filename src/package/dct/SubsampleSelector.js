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
 * @file Class for processing subsample strings.
 * @author James Reid
 */

// @ts-check

// @@imports-utils
import { DecoratedError } from "../utils/index.js"

// @@body
class SubsampleSelector {
    #luma
    #chromaBlue
    #chromaRed
    #total

    /**
     *
     * @param {string} subsampling
     */
    constructor(subsampling) {
        //
        const { luma, chromaBlue, chromaRed } = subsampling
            .match(/^(?<luma>[0-7]):(?<chromaBlue>[0-7]):(?<chromaRed>[0-7])$/)
            ?.groups || {}

        //
        if (!luma || !chromaBlue || !chromaRed) {
            throw new DecoratedError({
                name: "SubsamplingError",
                message: "Must be of form \"x:y:z\", digits from 0-7 inclusive",
                "subsampling-string": subsampling
            })
        }

        //
        this.#luma = parseInt(luma)
        this.#chromaBlue = parseInt(chromaBlue)
        this.#chromaRed = parseInt(chromaRed)
        this.#total = this.#luma + this.#chromaBlue + this.#chromaRed
    }

    /**
     *
     * @param {number} index
     * @returns {"luma"|"chromaBlue"|"chromaRed"}
     */
    key(index) {
        //
        const subsample = index % this.#total

        //
        return subsample < this.#luma ? "luma"
            : subsample < this.#luma + this.#chromaBlue ? "chromaBlue"
            : "chromaRed"
    }

    get luma() { return this.#luma }

    get chromaBlue() { return this.#chromaBlue }

    get chromaRed() { return this.#chromaRed }
}

// @@exports
export { SubsampleSelector }
