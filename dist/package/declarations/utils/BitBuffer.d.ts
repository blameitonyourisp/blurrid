/**
 * Buffer class allowing control over an appropriately sized array buffer at the
 * bit level rather than at the byte level.
 */
export class BitBuffer {
    /**
     * Decode serialized url-safe base 64 BitBuffer string, returning a new
     * BitBuffer instance containing the data from the original serialized
     * buffer.
     *
     * @param {string} string - Url-safe base 64 encoded BitBuffer string.
     * @returns {BitBuffer} Decoded BitBuffer instance.
     */
    static from(string: string): BitBuffer;
    /**
     * Convert 4 character url-safe base 64 string to 24-bit unsigned integer.
     *
     * @param {string} string - 4 character url-safe base 64 string.
     * @returns {number} Unsigned 24 bit integer.
     */
    static "__#2@#b64ToUint24"(string: string): number;
    /**
     * Convert 24-bit unsigned integer to 4 character url-safe base 64 string.
     *
     * @param {number} uint24 - Unsigned 24 bit integer.
     * @returns {string} 4 character url-safe base 64 string.
     */
    static "__#2@#uint24ToB64"(uint24: number): string;
    /**
     * Get bit length of a given number.
     *
     * @param {number} value - Input number.
     * @returns {number} Bit length.
     */
    static "__#2@#bitLength"(value: number): number;
    /**
     * Get url-safe base64 character dictionary, which uses different padding
     * characters to the standard base64 encoding in node. Please see
     * [here](https://developer.mozilla.org/en-US/docs/Glossary/Base64) for more
     * information on base64 encoding. For url safe characters, see rfc4648
     * [here](https://datatracker.ietf.org/doc/html/rfc4648#section-5).
     *
     * @returns {string} Url-safe base64 dictionary string.
     */
    static get "__#2@#dict"(): string;
    /**
     * Configure internal buffer property and required pointers.
     *
     * @param {object} obj - Configuration object argument.
     * @param {number} [obj.length] - Maximum character length of buffer when
     *      converted to url-safe base64 string.
     * @param {number} [obj.size] - Size of BitBuffer in *bytes*. Defaults to
     *      maximum allowable size as specified by the character length value.
     * @param {ArrayBuffer} [obj.buffer] - Internal array buffer.
     */
    constructor({ length, size, buffer }?: {
        length?: number | undefined;
        size?: number | undefined;
        buffer?: ArrayBuffer | undefined;
    });
    /**
     * Write an integer directly to internal buffer, updating write pointers to
     * the end of the written data.
     *
     * @param {number} int - Integer to write to buffer.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.size] - Size of buffer segment to write in bits.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Write signed or unsigned integer.
     * @returns {number} Integer written to buffer.
     */
    write(int: number, { size, offset, signed }?: {
        size?: number | undefined;
        offset?: number | undefined;
        signed?: boolean | undefined;
    }): number;
    /**
     * Write an integer to internal buffer with an absolute size declaration to
     * indicate how many bits are written (i.e. 5 additional bits written
     * indicating length of written data between 0 and 32 bits). Update write
     * pointers to the end of the written data.
     *
     * @param {number} int - Integer to write to buffer.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Write signed or unsigned integer.
     * @returns {number} Integer written to buffer.
     */
    writeAbsolute(int: number, { offset, signed }?: {
        offset?: number | undefined;
        signed?: boolean | undefined;
    }): number;
    /**
     * Write an integer to internal buffer with a relative size declaration to
     * indicate how many bits are written (i.e. 1 "sign" bit to indicate if more
     * or less bits than the previous write call are being written, and n "0"
     * bits where n is the relative size between the previous and next write
     * call sizes). Update write pointers to the end of the written data.
     *
     * @param {number} int - Integer to write to buffer.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Write signed or unsigned integer.
     * @returns {number} Integer written to buffer.
     */
    writeRelative(int: number, { offset, signed }?: {
        offset?: number | undefined;
        signed?: boolean | undefined;
    }): number;
    /**
     * Write a string of arbitrary length to the internal buffer.
     *
     * @param {string} string - String to write to buffer.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @returns {string} String written to buffer.
     */
    writeString(string: string, { offset }?: {
        offset?: number | undefined;
    }): string;
    /**
     * Read an integer directly from internal buffer, updating read pointers to
     * the end of the read data.
     *
     * @param {number} size - Size of buffer segment to read.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Read signed or unsigned integer.
     * @returns {number} Integer read from buffer.
     */
    read(size: number, { offset, signed }?: {
        offset?: number | undefined;
        signed?: boolean | undefined;
    }): number;
    /**
     * Read an integer from internal buffer, determining bit size of segment
     * by reading an absolute size declaration from the buffer indicating how
     * many bits should be read (i.e. 5 additional bits read before reading
     * integer to determine bit size of read segment between 0 and 32 bits).
     * Update read pointers to the end of the read data.
     *
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Read signed or unsigned integer.
     * @returns {number} Integer read from buffer.
     */
    readAbsolute({ offset, signed }?: {
        offset?: number | undefined;
        signed?: boolean | undefined;
    }): number;
    /**
     * Read an integer from internal buffer, determining bit size of segment by
     * reading a relative size declaration from the buffer indicating how many
     * bit should be read (i.e. 1 "sign" bit to indicate if more or less bits
     * than the previous read call are being read, and n "0" bits where n is the
     * relative size between the previous and next read call sizes). Update read
     * pointers to the end of the read data.
     *
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Read signed or unsigned integer.
     * @returns {number} Integer read from buffer.
     */
    readRelative({ offset, signed }?: {
        offset?: number | undefined;
        signed?: boolean | undefined;
    }): number;
    /**
     * Read a string of arbitrary length from the internal buffer.
     *
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @returns {string} String read from buffer.
     */
    readString({ offset }?: {
        offset?: number | undefined;
    }): string;
    /**
     * Copy data from source buffer (current buffer instance) to a target buffer
     * passed in the arguments. If no target buffer passed, new BitBuffer
     * instantiated with a length based on number of copied bits. Will update
     * read/write pointers in both source and target buffers.
     *
     * @param {object} obj - Configuration object of optional arguments.
     * @param {BitBuffer} [obj.target] - Target buffer to copy to.
     * @param {number} [obj.targetStart] - Start bit in target buffer.
     * @param {number} [obj.sourceStart] - Start bit in source buffer.
     * @param {number} [obj.sourceEnd] - End bit in source buffer.
     * @returns {BitBuffer} Target buffer with data copied from source buffer.
     */
    copy({ target, targetStart, sourceStart, sourceEnd }?: {
        target?: BitBuffer | undefined;
        targetStart?: number | undefined;
        sourceStart?: number | undefined;
        sourceEnd?: number | undefined;
    }): BitBuffer;
    /**
     * Convert buffer to serialized string of base-64 url-safe characters.
     *
     * @returns {string} Serialized buffer string.
     */
    toString(): string;
    /**
     * Get length of buffer in bits.
     *
     * @returns {number} Bit length of buffer.
     */
    get bitLength(): number;
    /**
     * Get length of buffer in bytes.
     *
     * @returns {number} Byte length of buffer.
     */
    get byteLength(): number;
    /**
     * Safely set current read pointer, observing bit size of buffer.
     *
     * @param {number} pointer - Updated read pointer.
     * @returns {void}
     */
    set readPointer(arg: number);
    /**
     * Get current read pointer.
     *
     * @returns {number} Internal read pointer.
     */
    get readPointer(): number;
    /**
     * Safely set last read size, observing max and min integer bit sizes.
     *
     * @param {number} size - Updated last read size in bits.
     * @returns {void}
     */
    set lastReadSize(arg: number);
    /**
     * Get last read size in bits.
     *
     * @returns {number} Internal last read size in bits.
     */
    get lastReadSize(): number;
    /**
     * Safely set current write pointer, observing bit size of buffer.
     *
     * @param {number} pointer - Updated write pointer.
     * @returns {void}
     */
    set writePointer(arg: number);
    /**
     * Get current write pointer.
     *
     * @returns {number} Internal write pointer.
     */
    get writePointer(): number;
    /**
     * Safely set last write size, observing max and min integer bit sizes.
     *
     * @param {number} size - Updated last write size in bits.
     * @returns {void}
     */
    set lastWriteSize(arg: number);
    /**
     * Get last write size in bits.
     *
     * @returns {number} Internal last write size in bits.
     */
    get lastWriteSize(): number;
    #private;
}
