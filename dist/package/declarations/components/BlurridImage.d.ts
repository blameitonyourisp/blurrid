export class BlurridImage extends HTMLImageElement {
    decoder: BlurridDecoder;
    loadImage(): void;
    loadOnClick(): void;
    loadOnIntersection(): void;
    #private;
}
import { BlurridDecoder } from "../dct/index.js";
