/**
 *
 * @param {number[]} sampleData
 * @param {number} width
 * @param {number} channels
 * @returns {number[][][]}
 */
export function expandSample(sampleData: number[], width: number, channels?: number): number[][][];
/**
 *
 * @param {number[][][]} expandedSample
 * @returns {number[]}
 */
export function collapseSample(expandedSample: number[][][]): number[];
