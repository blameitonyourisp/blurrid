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
 * @file Methods for generating webgl and context2d canvas elements.
 * @author James Reid
 */

// @ts-check

// @@imports-module
// @ts-expect-error: File is a glsl shader which will be loaded by rollup.
import vertexSource from "./shader.vert"
// @ts-expect-error: File is a glsl shader which will be loaded by rollup.
import fragmentSource from "./shader.frag"

// @@imports-types
/* eslint-disable no-unused-vars -- Types only used in comments. */
import { BlurridMetadata } from "../dct/index.js"
/* eslint-enable no-unused-vars -- Close disable-enable pair. */

// @@body
/**
 *
 * @param {BlurridMetadata} metadata
 * @returns {{canvas:HTMLCanvasElement, context:WebGLRenderingContext, program:WebGLProgram}} @no-wrap
 */
const getCanvasWebGL = metadata => {
    //
    const canvas = document.createElement("canvas")
    canvas.width = metadata.image.width
    canvas.height = metadata.image.height

    //
    const context = /** @type {WebGLRenderingContext} */
        (canvas.getContext("webgl"))

    const shaders = {
        vertex: getShader(context, context.VERTEX_SHADER, vertexSource),
        fragment: getShader(context, context.FRAGMENT_SHADER, fragmentSource, {
            SAMPLE_WIDTH: metadata.sample.width,
            SAMPLE_HEIGHT: metadata.sample.height,
            SAMPLE_MAX: metadata.sample.max,
            SAMPLE_NORMALIZED_TOTAL: metadata.sample.max ** 2
        })
    }

    const program = getProgram(context, shaders)

    const vertexData = {
        index: context.getAttribLocation(program, "a_position"), // Location of position attributes. @no-wrap
        size: 2, // 2 components (triangles) per iteration.
        type: context.FLOAT, // Data expected as 32-bit floats.
        normalize: false, // Don't normalise data.
        stride: 0, // 0 = move forward size * sizeof(type) each iteration to get the next position @no-wrap
        offset: 0 // Start at beginning of buffer
    }

    const positionBuffer = context.createBuffer()
    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)

    // triangle positions for drawing entire grid
    const positions = [- 1, 1, 1, 1, 1, - 1, 1, - 1, - 1, - 1, - 1, 1]
    context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array(positions),
        context.STATIC_DRAW
    )

    context.clearColor(0, 0, 0, 0)
    context.clear(context.COLOR_BUFFER_BIT)

    context.useProgram(program)

    context.enableVertexAttribArray(vertexData.index)

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const { index, size, type, normalize, stride, offset } = vertexData
    context.vertexAttribPointer(index, size, type, normalize, stride, offset)

    return { canvas, context, program }
}

/**
 *
 * @param {BlurridMetadata} metadata
 * @returns {{canvas:HTMLCanvasElement, context:CanvasRenderingContext2D}}
 */
const getCanvas2D = metadata => {
    //
    const canvas = document.createElement("canvas")
    canvas.width = metadata.image.width
    canvas.height = metadata.image.height

    //
    const context = /** @type {CanvasRenderingContext2D} */
        (canvas.getContext("2d"))

    return { canvas, context }
}

/**
 *
 * @param {WebGLRenderingContext} context
 * @param {{vertex:WebGLShader, fragment:WebGLShader}} shaders
 * @returns {WebGLProgram}
 */
const getProgram = (context, shaders) => {
    const program = /** @type {WebGLProgram} */ (context.createProgram())

    context.attachShader(program, shaders.vertex)
    context.attachShader(program, shaders.fragment)
    context.linkProgram(program)

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        console.warn(context.getProgramInfoLog(program))
        context.deleteProgram(program)
    }

    return program
}

/**
 * @param {WebGLRenderingContext} context
 * @param {number} type
 * @param {string} source
 * @param {Object.<string,number>} [view={}]
 * @returns {WebGLShader}
 */
const getShader = (context, type, source, view = {}) => {
    for (const key in view) {
        const regex = new RegExp(`{{${key}}}`, "g")
        source = source.replaceAll(regex, `${view[key]}`)
    }

    const shader = /** @type {WebGLShader} */ (context.createShader(type))

    context.shaderSource(shader, source)
    context.compileShader(shader)

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        console.warn(context.getShaderInfoLog(shader))
        context.deleteShader(shader)
    }

    return shader
}

// @@exports
export { getCanvasWebGL, getCanvas2D }
