export class BlurridImageWorker extends BlurridImage {
    /**
     *
     * @param {string} dataUrl
     * @param {object} target
     * @param {HTMLCanvasElement} target.canvas
     * @param {CanvasRenderingContext2D} target.context
     * @param {number} [width]
     */
    stepWorker(dataUrl: string, target: {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    }, width?: number | undefined): void;
    #private;
}
import { BlurridImage } from "./BlurridImage.js";
