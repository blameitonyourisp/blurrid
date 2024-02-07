export class BlurridEncoder {
    /**
     * Create encoder instance from downsized image sample.
     *
     * @param {object} obj - Object destructured argument.
     * @param {Buffer} obj.buffer - Buffer of flat, 4-channel rgba pixel data.
     * @param {number} obj.width - Width of downsized sample image for blur.
     * @param {number} obj.height - Height of downsized sample image for blur.
     */
    constructor({ buffer, width, height }: {
        buffer: Buffer;
        width: number;
        height: number;
    });
    /**
     * Encode downsized sample image into serialized string containing Blurrid
     * dct coefficients.
     *
     * @param {object} obj - Object destructured argument.
     * @param {number} [obj.length] - Desired length of encoded string.
     * @param {string} [obj.subsampling] - Chroma subsampling string of the form
     *      "Y:Cb:Cr" where Y, Cb, Cr are all 3-bit numbers from 0-7 inclusive,
     *      corresponding to the sampling rates of luma, chroma blue and chroma
     *      red dct coefficients in the encoded string.
     * @returns {string}
     */
    toString({ length, subsampling }?: {
        length?: number | undefined;
        subsampling?: string | undefined;
    }): string;
    #private;
}
