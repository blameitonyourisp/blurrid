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
 * @file BlurridImage web component, including worker fallback.
 * @author James Reid
 */

// @ts-check

// @@imports-package
import {
    getDataUrl,
    getCanvas2D,
    upsizeImageData,
    getBlurridWorker
} from "../shader/index.js"

// @@imports-module
import { BlurridImage } from "./BlurridImage.js"

// @@imports-utils
import { WorkerManager } from "../utils/index.js"

// @@body
let /** @type {WorkerManager|undefined} */ blurridWorkerManager

class BlurridImageWorker extends BlurridImage {
    #workerStart = parseInt(this.dataset.workerStart || "16")
    #workerSteps = parseInt(this.dataset.workerSteps || "2")

    constructor() { super() }

    blur() {
        const maxSamples = this.decoder.metadata.sample.max
        if (!window.WebGLRenderingContext || maxSamples > 16) {
            if (!blurridWorkerManager) {
                blurridWorkerManager = new WorkerManager(getBlurridWorker)
            }

            const target = getCanvas2D(this.decoder.metadata)
            this.stepWorker(target.canvas.toDataURL(), target)
        }
        else { this.src = getDataUrl(this.decoder) }
    }

    /**
     *
     * @param {string} dataUrl
     * @param {object} target
     * @param {HTMLCanvasElement} target.canvas
     * @param {CanvasRenderingContext2D} target.context
     * @param {number} [width]
     */
    stepWorker(dataUrl, target, width) {
        this.src = dataUrl

        width ??= this.#workerStart
        if (width < this.#workerStart * 2 ** this.#workerSteps) {
            const message = {
                serializedDct: this.decoder.serializedDct,
                width: width * 2
            }
            blurridWorkerManager?.enqueue(message, event => {
                const { imageData, imageData: { width } } = event.data
                upsizeImageData(target, imageData, this.decoder)
                    .then(dataUrl => {
                        this.stepWorker(dataUrl, target, width)
                    })
            })
        }
    }
}

// @@exports
export { BlurridImageWorker }
