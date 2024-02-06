/**
 *
 * @param {BlurridMetadata} metadata
 * @returns {{canvas:HTMLCanvasElement, context:WebGLRenderingContext, program:WebGLProgram}} @no-wrap
 */
export function getCanvasWebGL(metadata: BlurridMetadata): {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    program: WebGLProgram;
};
/**
 *
 * @param {BlurridMetadata} metadata
 * @returns {{canvas:HTMLCanvasElement, context:CanvasRenderingContext2D}}
 */
export function getCanvas2D(metadata: BlurridMetadata): {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
};
import { BlurridMetadata } from "../dct/index.js";
