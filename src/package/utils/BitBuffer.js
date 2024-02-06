// Copyright (c) 2024 James Reid. All rights reserved.
//
// This source code file is licensed under the terms of the MIT license, a copy
// of which may be found in the LICENSE.md file in the root of this repository.
//
// For a template copy of the license see one of the following 3rd party sites:
//      - <https://opensource.org/licenses/MIT>
//      - <https://choosealicense.com/licenses/mit>
//      - <https://spdx.org/licenses/MIT>

/**
 * @file Buffer class allowing control at bit level rather than byte level.
 * @author James Reid
 */

// @ts-check

// @@imports-module
import { DecoratedError } from "./decorate-cli.js"

// @@body
/**
 * Buffer class allowing control over an appropriately sized array buffer at the
 * bit level rather than at the byte level.
 */
class BitBuffer {
    #buffer
    #readPointer
    #lastReadSize
    #writePointer
    #lastWriteSize

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
    constructor({
        length = 16,
        size = Math.floor(length * 6 / 8),
        buffer = new ArrayBuffer(size)
    } = {}) {
        // Assign internal array buffer for implementation of BitBuffer.
        this.#buffer = buffer

        // Assign internal read pointers.
        this.#readPointer = 0
        this.#lastReadSize = 0

        // Assign internal write pointers.
        this.#writePointer = 0
        this.#lastWriteSize = 0
    }

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
    write(int, {
        size = BitBuffer.#bitLength(int),
        offset = this.#writePointer,
        signed = false
    } = {}) {
        // If all values are not writeable due to insufficient bits remaining
        // etc., then return no number.
        const writeable = this.#writeable()
            .append(int, { size, offset, signed })
        if (!writeable.isWriteable) { return NaN }

        return this.#write(int, { size, offset, signed })
    }

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
    writeAbsolute(int, { offset = this.#writePointer, signed = false } = {}) {
        // Size declaration data with the size of buffer segment it will occupy.
        const resize = { value: BitBuffer.#bitLength(int), size: 5 }

        // If all values are not writeable due to insufficient bits remaining
        // etc., then return no number.
        const writeable = this.#writeable()
            .append(resize.value, { ...resize, offset })
            .append(int, { signed })
        if (!writeable.isWriteable) { return NaN }

        // Write both size declaration data and integer to buffer.
        this.#write(resize.value, { ...resize, offset })
        const uint32 = this.#write(int, { signed })

        return uint32
    }

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
    writeRelative(int, { offset = this.#writePointer, signed = false } = {}) {
        // Write relative method relies on the first bit of the written integer
        // being "1", and therefore cannot write integer "0".
        if (int === 0) { int = 1 }

        // Size declaration data with the size of buffer segment it will occupy.
        const relativeSize = BitBuffer.#bitLength(int) - this.#lastWriteSize
        const resize = {
            // If increasing size, write a 1 bit shifted by the amount of bits
            // the data is bigger by, otherwise write a 0. Preserve required
            // bit length of size declaration using size property.
            value: relativeSize > 0 ? (1 << relativeSize) >>> 0 : 0,
            size: Math.abs(relativeSize) + 1
        }

        // If all values are not writeable due to insufficient bits remaining
        // etc., then return no number.
        const writeable = this.#writeable()
            .append(resize.value, { ...resize, offset })
            .append(int, { signed })
        if (!writeable.isWriteable) { return NaN }

        // Write both size declaration data and integer to buffer.
        this.#write(resize.value, { ...resize, offset })
        const uint32 = this.#write(int, { signed })

        return uint32
    }

    /**
     * Write a string of arbitrary length to the internal buffer.
     *
     * @param {string} string - String to write to buffer.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @returns {string} String written to buffer.
     */
    writeString(string, { offset = this.#writePointer } = {}) {
        // Size declaration data for bit length of length of string declaration.
        const resize = {
            value: BitBuffer.#bitLength(string.length),
            size: 5
        }

        // If all characters are not writeable due to insufficient bits
        // remaining etc., then return empty string.
        let writeable = this.#writeable()
            .append(resize.value, { ...resize })
            .append(string.length)
        for (let i = 0; i < string.length; i++) {
            writeable = writeable.append(0, { size: 8 })
        }
        if (!writeable.isWriteable) { return "" }

        // Write string length declaration and string to buffer.
        this.#write(resize.value, { ...resize, offset })
        this.#write(string.length)
        for (const char of string) {
            this.#write(char.charCodeAt(0), { size: 8 })
        }

        return string
    }

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
    read(size, { offset = this.#readPointer, signed = false } = {}) {
        // If all values are not readable due to insufficient bits remaining
        // etc., then return no number.
        const readable = this.#readable().append(size, { offset, signed })
        if (!readable.isReadable) { return NaN }

        return this.#read(size, { offset, signed })
    }

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
    readAbsolute({ offset = this.#readPointer, signed = false } = {}) {
        // Record read pointers for resetting if required.
        const readPointer = this.#readPointer
        const lastReadSize = this.#lastReadSize

        // Check if sufficient read bits remain to read both the size
        // declaration and integer.
        const readable = this.#readable().append(5, { offset })
        let size = 0
        if (readable.isReadable) {
            size = this.#read(5, { offset })
            readable.append(size, { signed })
        }

        // Reset pointers and return no number if insufficient remaining read
        // bits.
        if (!readable.isReadable || !size) {
            this.#readPointer = readPointer
            this.#lastReadSize = lastReadSize
            return NaN
        }

        return this.#read(size, { signed })
    }

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
    readRelative({ offset = this.#readPointer, signed = false } = {}) {
        // Record read pointers for resetting if required.
        const readPointer = this.#readPointer
        const lastReadSize = this.#lastReadSize

        // Get sign of relative size (i.e. are more or less bits to be read than
        // last read call).
        let sign = 1
        const readable = this.#readable().append(1, { offset })
        if (readable.isReadable) { sign = this.#read(1, { offset }) ? 1 : - 1 }

        // Get unsigned read size relative to size of last read call (reads
        // until first bit of integer to be read, then breaks).
        let relativeSize = 0
        while (readable.append(1).isReadable) {
            if (this.#read(1)) { break }
            relativeSize++
        }

        // Get size of integer to be read from buffer.
        const size = lastReadSize + sign * relativeSize
        readable.append(size, { signed })

        // Reset pointers and return no number if insufficient remaining read
        // bits.
        if (!readable.isReadable || !size) {
            this.#readPointer = readPointer
            this.#lastReadSize = lastReadSize
            return NaN
        }

        // Decrement read pointer to account for first bit of integer having
        // been read above.
        this.#readPointer--

        return this.#read(size, { signed })
    }

    /**
     * Read a string of arbitrary length from the internal buffer.
     *
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @returns {string} String read from buffer.
     */
    readString({ offset = this.#readPointer } = {}) {
        // Record read pointers for resetting if required.
        const readPointer = this.#readPointer
        const lastReadSize = this.#lastReadSize

        // Get bit size of string length declaration.
        const readable = this.#readable().append(5, { offset })
        let lengthSize = 0
        if (readable.isReadable) { lengthSize = this.#read(5, { offset }) }
        readable.append(lengthSize)

        // Get string length.
        let length = 0
        if (readable.isReadable) { length = this.#read(lengthSize) }

        // Reset pointers and return no number if insufficient remaining read
        // bits.
        if (!readable.isReadable || !length) {
            this.#readPointer = readPointer
            this.#lastReadSize = lastReadSize
            return ""
        }

        let string = ""
        for (let i = 0; i < length; i++) {
            // Ensure next byte (8 bit character) is readable.
            readable.append(8)

            // Reset pointers and return no number if insufficient remaining
            // read bits.
            if (!readable.isReadable) {
                this.#readPointer = readPointer
                this.#lastReadSize = lastReadSize
                return ""
            }

            // Read character from buffer and append to string.
            string += String.fromCharCode(this.#read(8))
        }

        return string
    }

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
    copy({
        target,
        targetStart = target?.writePointer || 0,
        sourceStart = 0,
        sourceEnd = this.bitLength
    } = {}) {
        // Throw error if source start or end bounds are out of buffer range.
        if (sourceStart < 0 || sourceEnd > this.bitLength) {
            throw new DecoratedError({
                name: "BitBufferError",
                message: "Requested bits out of source buffer range",
                "source-start": sourceStart,
                "source-end": sourceEnd,
                "source-bit-length": this.bitLength
            })
        }

        // Get number of source bits, and minimum size of target buffer in bytes
        // to store the data from the source buffer.
        const sourceBits = sourceEnd - sourceStart
        const targetSize = Math.ceil((sourceBits + targetStart) / 8)

        // Get available write bits in target buffer, instantiating a BitBuffer
        // of the correct size if none is passed in arguments.
        target ??= new BitBuffer({ size: targetSize })
        const targetBits = target.bitLength - targetStart

        // Throw error if not sufficient bits remaining in target buffer.
        if (sourceBits > targetBits) {
            throw new DecoratedError({
                name: "BitBufferError",
                message: "Source bits exceed bits available in target buffer",
                "source-bits": sourceBits,
                "target-bits": targetBits
            })
        }

        // Copy data bits from source buffer to target buffer.
        for (let i = 0; i < sourceBits; i++) {
            target.write(
                this.#read(1, { offset: sourceStart + i }),
                { size: 1, offset: targetStart + i }
            )
        }

        return target
    }

    /**
     * Convert buffer to serialized string of base-64 url-safe characters.
     *
     * @returns {string} Serialized buffer string.
     */
    toString() {
        // Initialize serialized string and pointers to track string fragments.
        let string = ""
        let pointer = 0
        let uint24 = 0

        // Loop over buffer, adding 4 character fragments to serialized string
        // for every 24 bits consumed from buffer (24-bit blocks consumed in
        // 3-byte blocks at time).
        const view = new Uint8Array(this.#buffer)
        for (let i = 0; i < Math.ceil(this.byteLength / 3) * 3; i++) {
            const byte = view[i] || 0
            uint24 = (uint24 | (byte << 16 - pointer * 8)) >>> 0
            pointer = ++pointer % 3
            if (!pointer) {
                string += BitBuffer.#uint24ToB64(uint24)
                uint24 = 0
            }
        }

        return string
    }

    /**
     * Create object containing
     */
    #writeable() {
        //
        const tracer = { writeable: true, offset: this.#writePointer }

        /**
         *
         * @param {number} int
         * @param {object} obj
         * @param {number} [obj.size]
         * @param {number} [obj.offset]
         * @param {boolean} [obj.signed]
         */
        const append = (int, {
            size = BitBuffer.#bitLength(int),
            offset = tracer.offset,
            signed = false
        } = {}) => {
            if (tracer.writeable) {
                const uint32 = Math.abs(int)
                const bitsRemaining = this.bitLength - offset

                tracer.writeable = !signed && int < 0 ? false
                    : BitBuffer.#bitLength(uint32) > size ? false
                    : !Number.isInteger(uint32) ? false
                    : size < 0 || size > 32 ? false
                    : size + (signed ? 1 : 0) > bitsRemaining ? false
                    : true
            }

            tracer.offset += size

            return { append, get isWriteable() { return tracer.writeable } }
        }

        return { append, get isWriteable() { return tracer.writeable } }
    }

    /**
     * Write sanitized integer directly to internal buffer, updating write
     * pointers to the end of the written data. This private method is called by
     * other class write methods *after* values have been checked to ensure that
     * they are not out of range, or will not fit in the remaining empty buffer
     * bits.
     *
     * @param {number} int - Integer to write to buffer.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.size] - Size of buffer segment to write in bits.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Write signed or unsigned integer.
     * @returns {number} Integer written to buffer.
     */
    #write(int, {
        size = BitBuffer.#bitLength(int),
        offset = this.#writePointer,
        signed = false
    } = {}) {
        // Get absolute value of integer to write.
        const uint32 = Math.abs(int)

        const { view, byteLength, subBit } = this.#getView(size, offset)
        for (let i = 0; i < byteLength; i++) {
            const byte = view.getUint8(i)
            let uint8 = 0
            for (let j = 0; j < 8; j++) {
                const index = i * 8 + j
                const bit = index < subBit || index > subBit + size
                    ? byte << 24 + j >>> 31
                    : uint32 << (32 - size) + (index - subBit) >>> 31
                uint8 = uint8 | (bit << 7 - j)
            }
            view.setUint8(i, uint8)
        }

        // Update write pointer and add sign bit *after* written integer.
        // NOTE: The sign bit is written at the end of integers in the BitBuffer
        // as this saves a bit when using the writeRelative and readRelative
        // methods. This is because the relative size declaration can be assumed
        // to end at the first non-zero bit (i.e. the start of the number),
        // rather than requiring an extra "1" end bit if the "1"/"0" sign bit
        // was written at the start of the number.
        this.#writePointer = offset + size
        if (signed) { this.#write(int >= 0 ? 1 : 0, { size: 1 }) }

        // Update last write size *after* sign bit such that the sign bit is
        // *not* considered as the last integer size written.
        this.#lastWriteSize = size

        return int
    }

    /**
     *
     */
    #readable() {
        const tracer = { readable: true, offset: this.#readPointer }

        const append = (/** @type {number} */ size, {
            offset = tracer.offset,
            signed = false
        } = {}) => {
            if (tracer.readable) {
                const bitsRemaining = this.bitLength - offset

                tracer.readable = size < 0 || size > 32 ? false
                    : size + (signed ? 1 : 0) > bitsRemaining ? false
                    : true
            }

            tracer.offset += size

            return { append, get isReadable() { return tracer.readable } }
        }

        return { append, get isReadable() { return tracer.readable } }
    }

    /**
     * Read sanitized integer directly from internal buffer, updating write
     * pointers to the end of the read data. This private method is called by
     * other class read methods *after* values have been checked to ensure that
     * they are not out of range.
     *
     * @param {number} size - Size of buffer segment to read.
     * @param {object} obj - Configuration object of optional arguments.
     * @param {number} [obj.offset] - Offset of segment within buffer in bits.
     * @param {boolean} [obj.signed] - Read signed or unsigned integer.
     * @returns {number} Integer read from buffer.
     */
    #read(size, { offset = this.#readPointer, signed = false } = {}) {
        const { view, byteLength, subBit } = this.#getView(size, offset)
        let uint32 = 0
        for (let i = 0; i < byteLength; i++) {
            const offset = 24 + subBit - i * 8
            uint32 = offset >= 0
                ? (uint32 | view.getUint8(i) << offset) >>> 0
                : (uint32 | view.getUint8(i) >>> - offset) >>> 0
        }

        this.#readPointer = offset + size
        const sign = signed && this.#read(1) === 0 ? - 1 : 1

        this.#lastReadSize = size

        return sign * (uint32 >>> 32 - size)
    }

    /**
     *
     * @param {*} size
     * @param {*} offset
     * @returns {{view:DataView,byteLength:number,subBit:number}} Object
     *      containing requested dataview of BitBuffer at the given offset.
     */
    #getView(size, offset) {
        const startByte = Math.floor(offset / 8)
        const subBit = offset - 8 * startByte
        const byteLength = Math.ceil((subBit + size) / 8)
        if (startByte + byteLength > this.byteLength) {
            // throw new BitBuffer.#RangeError(size, offset)
        }
        const view = new DataView(this.#buffer, startByte, byteLength)
        return { view, byteLength, subBit }
    }

    /**
     * Get length of buffer in bits.
     *
     * @returns {number} Bit length of buffer.
     */
    get bitLength() { return this.byteLength << 3 }

    /**
     * Get length of buffer in bytes.
     *
     * @returns {number} Byte length of buffer.
     */
    get byteLength() { return this.#buffer.byteLength }

    /**
     * Get current read pointer.
     *
     * @returns {number} Internal read pointer.
     */
    get readPointer() { return this.#readPointer }

    /**
     * Safely set current read pointer, observing bit size of buffer.
     *
     * @param {number} pointer - Updated read pointer.
     * @returns {void}
     */
    set readPointer(pointer) {
        // Ignore updated pointer if it is out of range.
        if (pointer < 0 || pointer > this.bitLength) { return }

        // Update internal pointer.
        this.#readPointer = pointer
    }

    /**
     * Get last read size in bits.
     *
     * @returns {number} Internal last read size in bits.
     */
    get lastReadSize() { return this.#lastReadSize }

    /**
     * Safely set last read size, observing max and min integer bit sizes.
     *
     * @param {number} size - Updated last read size in bits.
     * @returns {void}
     */
    set lastReadSize(size) {
        // Ignore updated size if not within max and min integer bit sizes.
        if (size < 0 || size > 32) { return }

        // Update internal read size.
        this.#lastReadSize = size
    }

    /**
     * Get current write pointer.
     *
     * @returns {number} Internal write pointer.
     */
    get writePointer() { return this.#writePointer }

    /**
     * Safely set current write pointer, observing bit size of buffer.
     *
     * @param {number} pointer - Updated write pointer.
     * @returns {void}
     */
    set writePointer(pointer) {
        // Ignore updated pointer if it is out of range.
        if (pointer < 0 || pointer > this.bitLength) { return }

        // Update internal pointer.
        this.#writePointer = pointer
    }

    /**
     * Get last write size in bits.
     *
     * @returns {number} Internal last write size in bits.
     */
    get lastWriteSize() { return this.#lastWriteSize }

    /**
     * Safely set last write size, observing max and min integer bit sizes.
     *
     * @param {number} size - Updated last write size in bits.
     * @returns {void}
     */
    set lastWriteSize(size) {
        // Ignore updated size if not within max and min integer bit sizes.
        if (size < 0 || size > 32) { return }

        // Update internal write size.
        this.#lastWriteSize = size
    }

    /**
     * Decode serialized url-safe base 64 BitBuffer string, returning a new
     * BitBuffer instance containing the data from the original serialized
     * buffer.
     *
     * @param {string} string - Url-safe base 64 encoded BitBuffer string.
     * @returns {BitBuffer} Decoded BitBuffer instance.
     */
    static from(string) {
        // Throw error if input string not correctly encoded.
        if (!string.match(/^[A-Za-z0-9\-_]*$/)) {
            throw new DecoratedError({
                name: "BitBufferError",
                message: "Encoded string is not url-safe base 64 encoded",
                "encoded-string": string
            })
        }

        // Create new BitBuffer instance based on length of input string.
        const buffer = new BitBuffer({ size: Math.ceil(string.length * 3 / 4) })

        // Split input string into 4-character segments, convert each segment
        // into 24-bit unsigned integer, and write to new BitBuffer instance.
        const regex = /[A-Za-z0-9\-_]{1,4}/g
        for (const match of string.match(regex) || []) {
            const uint24 = BitBuffer.#b64ToUint24(match.padEnd(4, "A"))
            buffer.write(uint24, { size: 24 })
        }

        // Reset read and write pointers.
        buffer.writePointer = 0
        buffer.readPointer = 0

        return buffer
    }

    /**
     * Convert 4 character url-safe base 64 string to 24-bit unsigned integer.
     *
     * @param {string} string - 4 character url-safe base 64 string.
     * @returns {number} Unsigned 24 bit integer.
     */
    static #b64ToUint24(string) {
        let uint24 = 0

        // Loop over characters of input string, converting each url-safe base
        // 64 character to a 6-bit integer. Bitwise SHIFT the result such that
        // the 6 data bits occupy a unique sector of the uint24 output, and
        // bitwise AND the result with the uint24 output.
        for (const [index, char] of string.split("").entries()) {
            const uint6 = BitBuffer.#dict.indexOf(char)
            uint24 = (uint24 | (uint6 << 18 - index * 6)) >>> 0
        }

        return uint24
    }

    /**
     * Convert 24-bit unsigned integer to 4 character url-safe base 64 string.
     *
     * @param {number} uint24 - Unsigned 24 bit integer.
     * @returns {string} 4 character url-safe base 64 string.
     */
    static #uint24ToB64(uint24) {
        let string = ""

        // Divide 24-bit integer into 6-bit segments, appending a url-safe base
        // 64 character to output string for each segment.
        for (let i = 0; i < 4; i++) {
            const uint6 = uint24 >>> 18 - i * 6 << 26 >>> 26
            string += BitBuffer.#dict[uint6]
        }

        return string
    }

    /**
     * Get bit length of a given number.
     *
     * @param {number} value - Input number.
     * @returns {number} Bit length.
     */
    static #bitLength(value) { return Math.abs(value).toString(2).length }

    /**
     * Get url-safe base64 character dictionary, which uses different padding
     * characters to the standard base64 encoding in node. Please see
     * [here](https://developer.mozilla.org/en-US/docs/Glossary/Base64) for more
     * information on base64 encoding. For url safe characters, see rfc4648
     * [here](https://datatracker.ietf.org/doc/html/rfc4648#section-5).
     *
     * @returns {string} Url-safe base64 dictionary string.
     */
    static get #dict() {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + // Uppercase alpha characters.
            "abcdefghijklmnopqrstuvwxyz" + // Lowercase alpha characters.
            "0123456789" + // Number characters.
            "-_" // Url-safe padding characters for total of 64 characters.
    }
}

// @@exports
export { BitBuffer }
