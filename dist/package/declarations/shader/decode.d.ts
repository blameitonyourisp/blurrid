/**
 *
 * @param {BlurridDecoder} decoder
 * @returns {string}
 */
export function getDataUrl(decoder: BlurridDecoder): string;
/**
 *
 * @param {object} target
 * @param {HTMLCanvasElement} target.canvas
 * @param {CanvasRenderingContext2D} target.context
 * @param {ImageData} imageData
 * @param {BlurridDecoder} decoder
 * @returns {Promise.<string>}
 */
export function upsizeImageData(target: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
}, imageData: ImageData, decoder: BlurridDecoder): Promise<string>;
import { BlurridDecoder } from "../dct/index.js";
