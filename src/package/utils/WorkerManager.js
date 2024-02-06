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
 * @file Class for managing multiple workers up to a specified limit.
 * @author James Reid
 */

// @ts-check

// @@no-imports

// @@body
// note that shared workers are not possible due to not being currently
// available in chrome for android https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker @no-wrap
class WorkerManager {
    #queue = /** @type {{message:any, callback:(event:any)=>void}[]} */ ([])
    #workers = /** @type {Map.<Worker, number>} */ (new Map())
    #instantiateWorker
    #limit

    /**
     *
     * @param {()=>Worker} callback
     * @param {object} obj
     * @param {number} [obj.limit]
     */
    constructor(callback, { limit = 4 } = {}) {
        this.#instantiateWorker = callback
        this.#limit = limit
    }

    /**
     *
     * @returns {Worker}
     */
    addWorker() {
        const worker = this.#instantiateWorker()
        this.#workers.set(worker, NaN)
        return worker
    }

    /**
     *
     * @param {Worker} worker
     * @param {any} message
     * @param {(event:any)=>void} callback
     */
    postWorker(worker, message, callback) {
        this.#workers.set(worker, NaN)
        worker.onmessage = event => {
            this.#dequeue(worker)
            callback(event)
        }
        worker.postMessage(message)
    }

    /**
     *
     * @param {any} message
     * @param {(event:any)=>void} callback
     */
    enqueue(message, callback) {
        let /** @type {Worker|undefined} */ worker
        for (const [existingWorker, timeLastActive] of this.#workers) {
            if (timeLastActive) {
                worker = existingWorker
                break
            }
        }

        if (worker) { this.postWorker(worker, message, callback) }
        else if (this.#workers.size < this.#limit) {
            worker = this.addWorker()
            this.postWorker(worker, message, callback)
        }
        else { this.#queue.push({ message, callback }) }
    }

    /**
     *
     * @param {Worker} worker
     */
    #dequeue(worker) {
        const { message, callback } = this.#queue.shift() || {}
        if (message && callback) {
            this.postWorker(worker, message, callback)
        }
        else {
            this.#workers.set(worker, Date.now())
            setTimeout(() => {
                const timeLastActive = /** @type {number} */
                    (this.#workers.get(worker))
                if (Date.now() - timeLastActive > 1000) {
                    worker.terminate()
                    this.#workers.delete(worker)
                }
            }, 1050)
        }
    }
}

// @@exports
export { WorkerManager }
