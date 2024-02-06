export class BlurridEncoder {
    /**
     *
     * @param {object} obj
     * @param {Buffer} obj.buffer
     * @param {number} obj.width
     * @param {number} obj.height
     */
    constructor({ buffer, width, height }: {
        buffer: Buffer;
        width: number;
        height: number;
    });
    toString({ length, subsampling }?: {
        length?: number | undefined;
        subsampling?: string | undefined;
    }): string;
    #private;
}
