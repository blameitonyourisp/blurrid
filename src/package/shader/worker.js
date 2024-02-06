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
 * @file Worker backup for generating image blur placeholders without gpu.
 * @author James Reid
 */

// @ts-check

// @@imports-package
import { BlurridDecoder } from "../dct/BlurridDecoder.js"

// @@body
onmessage = event => {
    const decoder = new BlurridDecoder(event.data.serializedDct)

    decoder.metadata.resize(event.data.width)
    const imageData = new ImageData(
        new Uint8ClampedArray(decoder.toImageData()),
        decoder.metadata.image.width,
        decoder.metadata.image.height
    )

    postMessage({ imageData })
}

// @@no-exports
