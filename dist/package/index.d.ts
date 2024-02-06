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

/**
 * Load image from file, returning buffer of flat, 3-channel rgb pixel data, and
 * metadata pertaining to the image.
 *
 * @param {string} path - Relative path to image from point of execution.
 * @param {number} samples - Maximum dimension of image in any direction.
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
