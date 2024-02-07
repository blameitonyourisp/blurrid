/**
 * Load image from file, returning buffer of flat, 4-channel rgba pixel data,
 * and metadata pertaining to the image which is required for.
 *
 * @param {string} path - Relative path to image from point of execution.
 * @param {number} samples - Maximum dimension of downsized sample image in any
 *      direction. Note that, due to max uniform limits in webgl fragment
 *      shaders, sample sizes greater than 16 will prevent a blur from being
 *      created using the webgl canvas. In this case the web component will
 *      set the image loading to `eager`, or will use web workers as a fallback
 *      if available to render the blur.
 * @returns {Promise.<{buffer:Buffer, width:number, height:number}>} Data buffer
 *      and image metadata.
 */
export function loadImage(path: string, samples?: number): Promise<{
    buffer: Buffer;
    width: number;
    height: number;
}>;
/**
 * Save flat array of 3-channel rgb pixel data to image file.
 *
 * @param {BlurridDecoder} decoder - Image pixel data in flat array.
 * @param {string} path - Relative path of new image from point of execution.
 * @returns {Promise.<sharp.OutputInfo>} Sharp output details.
 */
export function saveImage(decoder: BlurridDecoder, path: string): Promise<sharp.OutputInfo>;
import { BlurridDecoder } from "../dct/index.js";
import sharp from "sharp";
