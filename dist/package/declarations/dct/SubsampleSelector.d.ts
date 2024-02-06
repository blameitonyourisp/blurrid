export class SubsampleSelector {
    /**
     *
     * @param {string} subsampling
     */
    constructor(subsampling: string);
    /**
     *
     * @param {number} index
     * @returns {"luma"|"chromaBlue"|"chromaRed"}
     */
    key(index: number): "luma" | "chromaBlue" | "chromaRed";
    get luma(): number;
    get chromaBlue(): number;
    get chromaRed(): number;
    #private;
}
