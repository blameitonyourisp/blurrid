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
 * @file Package entrypoint.
 * @author James Reid
 */

// @ts-check

// @@no-imports

// @@body
/**
 * @todo add support for picture elements https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture @no-wrap
 * @todo allow shader to also render on smaller canvas which can be upsized
 * @todo hand minify shader
 * @todo hand code-split methods in classes such as BitBuffer to reduce bundle size @no-wrap
 * @todo make rollup plugin to add worker to bundle
 * @todo add worker to bundle by string
 * @todo remove error logging from web build to reduce bundle size
 * @todo allow loading of images to encode from web url
 * @todo add parser which will automatically encode and convert images in an
 *      html file into blurrid image components
 */

/**
 * Notes on workers:
 * - https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * - https://stackoverflow.com/questions/60354722/web-workers-inside-a-js-library-with-rollup @no-wrap
 * - https://dannadori.medium.com/how-to-bundle-webworker-in-npm-package-620dcec922e1 @no-wrap
 * - https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string @no-wrap
 */

/**
 * Notes on bundling web-workers for end users:
 * - https://www.npmjs.com/package/worker-loader
 * - https://parceljs.org/languages/javascript/#workers
 * - https://webpack.js.org/guides/web-workers/
 */

// @@exports
export { BlurridEncoder, BlurridDecoder } from "./dct/index.js"
export { loadImage, saveImage } from "./sharp/index.js"
