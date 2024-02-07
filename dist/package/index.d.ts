import sharp from 'sharp';

/**
 * @file Class for building and accessing dct metadata.
 * @author James Reid
 */
declare class BlurridMetadata {
    /**
     *
     * @param {object} obj
     * @param {object} obj.image
     * @param {number} obj.image.width
     * @param {number} obj.image.height
     * @param {object} obj.sample
     * @param {number} obj.sample.width
     * @param {number} obj.sample.height
     */
    constructor({ image, sample }: {
        image: {
            width: number;
            height: number;
        };
        sample: {
            width: number;
            height: number;
        };
    });
    /**
     *
     * @param {number} width
     */
    resize(width: number): void;
    get image(): {
        width: number;
        height: number;
    };
    get sample(): {
        max: number;
        width: number;
        height: number;
    };
    #private;
}

declare class BlurridDecoder {
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

declare class BlurridEncoder {
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
declare function loadImage(path: string, samples?: number): Promise<{
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
declare function saveImage(decoder: BlurridDecoder, path: string): Promise<sharp.OutputInfo>;

export { BlurridDecoder, BlurridEncoder, loadImage, saveImage };
