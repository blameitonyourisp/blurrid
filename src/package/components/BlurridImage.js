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
 * @file BlurridImage web component, not including worker fallback.
 * @author James Reid
 */

// @ts-check

// @@imports-package
import { BlurridDecoder } from "../dct/index.js"
import { getDataUrl, getCanvas2D } from "../shader/index.js"

// @@body
class BlurridImage extends HTMLImageElement {
    decoder = new BlurridDecoder(this.dataset.blurrid || "A".repeat(10))

    constructor() {
        super()

        const listener = () => {
            this.removeEventListener("load", listener)
            this.blur()
            this.dataset.loading === "onclick" ? this.loadOnClick()
                : this.dataset.loading === "lazy" ? this.loadOnIntersection()
                : this.loadImage()
        }
        this.addEventListener("load", listener)

        if (this.#blurWidth) { this.decoder.metadata.resize(this.#blurWidth) }

        const { canvas } = getCanvas2D(this.decoder.metadata)
        this.src = canvas.toDataURL()
    }

    blur() {
        const maxSamples = this.decoder.metadata.sample.max
        if (!window.WebGLRenderingContext || maxSamples > 16) {
            console.warn(`<WARNING> BlurridImage:
WebGL rendering context unavailable or too many uniforms, try worker fallback`)
            this.dataset.loading = "eager"
        }
        else { this.src = getDataUrl(this.decoder) }
    }

    loadImage() {
        const image = document.createElement("img")

        for (const attribute of this.attributes) {
            const { name, value } = attribute
            if (this.#reservedAttributes.includes(name)) { continue }
            image.setAttribute(name, value)
        }

        const listener = () => {
            image.removeEventListener("load", listener)

            // Hard set image (and by extension also cloned image) width and
            // height to avoid content jumping due to `position: absolute`
            // setting size relative to page root element if the immediate
            // image parent container does not have `position:relative` set
            // (see here https://stackoverflow.com/a/14327156). Also avoids
            // content jumping if the decoded blur size and image src size are
            // different (for instance if the blur is calculated on the full
            // image, and the fetched src is a downsized image).
            const { width, height } = this.getBoundingClientRect()
            image.style.width = `${width}px`
            image.style.height = `${height}px`

            const keyframes = [{ opacity: 1 }, { opacity: 0 }]
            const options = { easing: "ease-out", duration: 500 }

            const clone = /** @type {HTMLImageElement} */ (image.cloneNode())
            clone.style.opacity = "0"
            clone.style.position = "absolute"
            this.before(clone)

            this.animate(keyframes, options)
            clone.animate(keyframes, { ...options, direction: "reverse" })
                .addEventListener("finish", () => {
                    this.replaceWith(image)
                    clone.remove()
                })
        }

        image.addEventListener("load", listener)

        if (this.dataset.srcset) {
            image.setAttribute("srcset", this.dataset.srcset)
        }
        image.setAttribute("src", this.dataset.src || "")
    }

    loadOnClick() {
        const listener = () => {
            this.removeEventListener("click", listener)
            this.loadImage()
        }

        this.addEventListener("click", listener)
    }

    loadOnIntersection() {
        const options = /** @type {IntersectionObserverInit} */ ({
            threshold: 0.5
        })

        const observer = new IntersectionObserver(entries => {
            const entry = entries[0]
            if (entry.isIntersecting) {
                observer.disconnect()
                this.loadImage()
            }
        }, options)

        observer.observe(this)
    }

    get #blurWidth() {
        if (this.dataset.size) { return parseInt(this.dataset.size) }
        if (!this.sizes || !this.dataset.srcset) { return undefined }

        let slotSize
        const regexps = {
            sizes: /(?<query>\(.*\))[\s\n]*(?<width>\d*)(?<unit>px|vw),/g,
            sizesFallback: /(?<width>\d*)(?<unit>px|vw)[\s\n]*$/,
            srcset: /[\s\n](?<srcsetWidth>\d*)w,?/g
        }

        //
        for (const match of this.sizes.matchAll(regexps.sizes)) {
            const { query, width, unit } = match?.groups || {}
            if (matchMedia(query).matches) {
                slotSize = { width, unit }
                break
            }
        }

        //
        if (!slotSize) {
            const { width, unit } =
                this.sizes.match(regexps.sizesFallback)?.groups || {}
            slotSize = { width, unit }
        }

        //
        const slotWidth = slotSize?.unit === "vw"
            ? (parseInt(slotSize?.width || "0")) / 100 * window.innerWidth
            : parseInt(slotSize?.width || "0")

        //
        for (const match of this.dataset.srcset.matchAll(regexps.srcset)) {
            const { srcsetWidth } = match?.groups || {}
            if (parseInt(srcsetWidth) >= slotWidth) {
                return parseInt(srcsetWidth)
            }
        }

        return undefined
    }

    get #reservedAttributes() {
        return [
            "is",
            "src",
            "data-src",
            "data-srcset",
            "data-loading",
            "data-blurrid",
            "data-worker-start",
            "data-worker-steps"
        ]
    }
}

// @@exports
export { BlurridImage }
