/**
 * Load image from file, returning buffer of flat, 3-channel rgb pixel data, and
 * metadata pertaining to the image.
 *
 * @param {string} path - Relative path to image from point of execution.
 * @param {number} samples - Maximum dimension of image in any direction.
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
