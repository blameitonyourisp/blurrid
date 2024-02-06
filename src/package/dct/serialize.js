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
 * @file Global variables for buffer start locations for certain data.
 * @author James Reid
 */

// @ts-check

// @@no-imports

// @@body
const BUFFER_LOCATIONS = {
    METADATA: 0,
    SUBSAMPLING: 48,
    COEFFICIENTS: 57,
    ASSUMED_COEFFICIENT_SIZE: 8
}

// @@exports
export { BUFFER_LOCATIONS }
