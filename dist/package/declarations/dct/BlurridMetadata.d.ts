/**
 * @file Class for building and accessing dct metadata.
 * @author James Reid
 */
export class BlurridMetadata {
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
