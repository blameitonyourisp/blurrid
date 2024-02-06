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
 * @file Array dimension conversions for jpg dct compression algorithm.
 * @author James Reid
 */

// @ts-check

// @@imports-utils
import { DecoratedError } from "../utils/decorate-cli.js"

// @@body
/**
 *
 * @param {number[]} sampleData
 * @param {number} width
 * @param {number} channels
 * @returns {number[][][]}
 */
const expandSample = (sampleData, width, channels = 3) => {
    if (sampleData.length % channels) {
        throw new DecoratedError({
            name: "ChannelError",
            message: "Data length is not a multiple of requested channel count",
            "data-length": sampleData.length,
            "channels-requested": channels
        })
    }

    /** @type {number[][]} */
    const channelData = Array.from(Array.from({ length: channels }), () => [])
    for (const [i, pixel] of sampleData.entries()) {
        channelData[i % channels].push(pixel)
    }

    return channelData.map(channel => expandChannel(channel, width))
}

/**
 *
 * @param {number[]} channel1D
 * @param {number} width
 * @returns {number[][]}
 */
const expandChannel = (channel1D, width) => {
    if (channel1D.length % width) {
        throw new DecoratedError({
            name: "ChannelError",
            message: "Channel length is not a multiple of row width",
            "channel-length": channel1D.length,
            "row-width": width
        })
    }

    /** @type {number[][]} */
    const channel2D = Array.from(
        Array.from({ length: channel1D.length / width }),
        () => []
    )

    for (const [i, pixel] of channel1D.entries()) {
        channel2D[Math.floor(i / width)].push(pixel)
    }

    return channel2D
}

/**
 *
 * @param {number[][][]} expandedSample
 * @returns {number[]}
 */
const collapseSample = expandedSample => {
    const channelData = expandedSample.map(channel => collapseChannel(channel))

    const length = channelData[0].length
    const sampleData = Array
        .from({ length: channelData.length * length })
        .fill(0)

    for (const [i, channel] of channelData.entries()) {
        if (channel.length !== length) {
            throw new DecoratedError({
                name: "ChannelError",
                message: "Sample channels not of same length",
                "default-length": length,
                "channel-length": channel.length
            })
        }
        for (const [j, pixel] of channel.entries()) {
            sampleData[channelData.length * j + i] = pixel
        }
    }

    return sampleData
}

/**
 *
 * @param {number[][]} channel2D
 * @returns {number[]}
 */
const collapseChannel = channel2D => {
    const width = channel2D[0].length
    const channel1D = []

    for (const channelRow of channel2D) {
        if (channelRow.length !== width) {
            throw new DecoratedError({
                name: "ChannelError",
                message: "Channel row width does not match sample width",
                "sample-width": length,
                "row-width": channelRow.length
            })
        }
        channel1D.push(...channelRow)
    }

    return channel1D
}

// @@exports
export { expandSample, collapseSample }
