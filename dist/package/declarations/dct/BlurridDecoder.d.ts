export class BlurridDecoder {
    /**
     *
     * @param {string} serializedDct
     */
    constructor(serializedDct: string);
    toImageData(): number[];
    get serializedDct(): string;
    get metadata(): BlurridMetadata;
    get coefficients(): {
        luma: number[][];
        chromaBlue: number[][];
        chromaRed: number[][];
    };
    #private;
}
import { BlurridMetadata } from "./BlurridMetadata.js";
