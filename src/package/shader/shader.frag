precision mediump float;

uniform vec4 u_color;
uniform float u_image_width;
uniform float u_image_height;

uniform float u_lumaDct[{{SAMPLE_NORMALIZED_TOTAL}}];
uniform float u_chromaBlueDct[{{SAMPLE_NORMALIZED_TOTAL}}];
uniform float u_chromaRedDct[{{SAMPLE_NORMALIZED_TOTAL}}];


float kFactor(int x) {
    if (x == 0) { return 0.7071; }
    else { return 1.0; }
}

float decode1D(float array1D[{{SAMPLE_MAX}}], float point, int samples) {
    float float_samples = float(samples);

    float result = 0.0;

    for (int i = 0; i < {{SAMPLE_MAX}}; i ++) {
        if (float(array1D[i]) == 0.0 || i >= samples) { break; }

        float partial = float(array1D[i]) * cos(
            ((2.0 * point + 1.0) * 3.14 * float(i)) / (2.0 * float_samples)
        );

        partial *= kFactor(i);
        result += partial;
    }

    result *= sqrt(2.0 / float_samples);

    return result;
}

float decode2D(float array2D[{{SAMPLE_NORMALIZED_TOTAL}}], vec2 uv) {
    float row[{{SAMPLE_MAX}}];

    float x = uv.x * {{SAMPLE_WIDTH}}.0;
    float y = (1.0 - uv.y) * {{SAMPLE_HEIGHT}}.0;

    for (int i = 0; i < {{SAMPLE_MAX}}; i ++) {
        float column[{{SAMPLE_MAX}}];
        for (int j = 0; j < {{SAMPLE_MAX}}; j ++) {
            column[j] = array2D[i * {{SAMPLE_MAX}} + j];
        }
        row[i] = decode1D(column, y, {{SAMPLE_HEIGHT}});
    }

    float result = decode1D(row, x, {{SAMPLE_WIDTH}});

    return result;
}

vec4 yCbCrToRgb(float luma, float chromaBlue, float chromaRed) {
    //
    float red = luma + 1.40 * (chromaRed - 128.0);
    float green = luma - 0.34 * (chromaBlue - 128.0) - 0.71 * (chromaRed - 128.0);
    float blue = luma + 1.77 * (chromaBlue - 128.0);

    //
    red = floor(clamp(red, 0.0, 255.0) + 0.5) / 255.0;
    green = floor(clamp(green, 0.0, 255.0) + 0.5) / 255.0;
    blue = floor(clamp(blue, 0.0, 255.0) + 0.5) / 255.0;

    return vec4(red, green, blue, 1.0);
}

void main() {
    //
    vec2 uv = gl_FragCoord.xy;
    uv.x /= u_image_width;
    uv.y /= u_image_height;

    //
    gl_FragColor = yCbCrToRgb(
        decode2D(u_lumaDct, uv),
        decode2D(u_chromaBlueDct, uv),
        decode2D(u_chromaRedDct, uv)
    );
}
