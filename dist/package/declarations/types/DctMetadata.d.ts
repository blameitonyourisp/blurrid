export type DctMetadata = {
    image: {
        width: number;
        height: number;
    };
    sample: {
        width: number;
        height: number;
        max?: number | undefined;
        total?: number | undefined;
    };
    length: number;
    subsampling: string;
};
