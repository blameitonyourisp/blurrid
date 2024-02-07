/**
 * @file Functions for decorating cli strings.
 * @author James Reid
 */
/**
 * Custom error which renders an error in a uniform way, taking an options
 * object with reserved name and message fields, and then any other fields
 * relevant to the error, and rendering them with indentation.
 */
export class DecoratedError extends Error {
    /**
     * Build new error based on supplied options object which may set the custom
     * name of the error, the top level message of the error, and then any
     * number of other custom fields.
     *
     * @param {Object.<string,string|number|boolean>} options - Options object
     *      containing any string keys, and string, number or boolean values.
     */
    constructor(options: {
        [x: string]: string | number | boolean;
    });
}
/**
 * Decorate a string with control characters for changing cli string colors and
 * text decoration. Adds supplied list of modifiers for the string, then uses
 * reset character to set text back to default.
 *
 * @summary Return original string decorated with control characters.
 * @param {string} string - String to be decorated.
 * @param {object} options - Options object.
 * @param {string[]} [options.modifiers] - String array of modifiers/control
 *      characters to apply input string.
 * @param {number} [options.tabs] - Number of tab indents to include on string.
 * @param {number} [options.tabSize] - Number of spaces for each tab.
 * @returns {string} Original string decorated with control characters.
 */
export function decorate(string: string, { modifiers, tabs, tabSize }?: {
    modifiers?: string[] | undefined;
    tabs?: number | undefined;
    tabSize?: number | undefined;
}): string;
/**
 * Wrapper around decorate function to decorate a string with a foreground
 * colour control character, and optional number of tab indents.
 *
 * @summary Decorate a string with a foreground colour control character.
 * @param {string} string - String to be decorated.
 * @param {string} color - Desired foreground colour of string.
 * @param {number} [tabs=0] - Number of tab indents to include on string.
 * @returns {string} Original string decorated with color control character.
 */
export function decorateFg(string: string, color: string, tabs?: number | undefined): string;
/**
 * Wrapper around decorate function to decorate a string with a background
 * colour control character, and optional number of tab indents.
 *
 * @summary Decorate a string with a background colour control character.
 * @param {string} string - String to be decorated.
 * @param {string} color - Desired background colour of string.
 * @param {number} [tabs=0] - Number of tab indents to include on string.
 * @returns {string} Original string decorated with color control character.
 */
export function decorateBg(string: string, color: string, tabs?: number | undefined): string;
/**
 * Wrapper around String.prototype.padEnd method, which pads end of string
 * whilst ignoring length of control characters which will not be rendered by
 * the console (i.e. pad string such that the displayed string will be the
 * correct length when logged in the console).
 *
 * @summary Pad end of string, ignoring length of control characters.
 * @param {string} string - String to be padded.
 * @param {number} maxLength - Maximum length of string.
 * @param {string} [fillString] - Optional fill string passed to
 *      String.prototype.padEnd method
 * @returns {string} Original string padded at end, ignoring length of control
 *      characters.
 */
export function padEndDecorated(string: string, maxLength: number, fillString?: string | undefined): string;
/**
 * Wrapper around String.prototype.padStart method, which pads start of string
 * whilst ignoring length of control characters which will not be rendered by
 * the console (i.e. pad string such that the displayed string will be the
 * correct length when logged in the console).
 *
 * @summary Pad start of string, ignoring length of control characters.
 * @param {string} string - String to be padded.
 * @param {number} maxLength - Maximum length of string.
 * @param {string} [fillString] - Optional fill string passed to
 *      String.prototype.padStart method
 * @returns {string} Original string padded at end, ignoring length of control
 *      characters.
 */
export function padStartDecorated(string: string, maxLength: number, fillString?: string | undefined): string;
export namespace cliModifiers {
    let fgColors: {
        [x: string]: string;
    };
    let bgColors: {
        [x: string]: string;
    };
    let decorations: {
        [x: string]: string;
    };
}
/**
 * Convert kebab-case string to camelCase string, removing all hyphens in input
 * string, and capitalising the first character following each hyphen. Options
 * available for generating UpperCamelCase strings, and spaced strings too.
 *
 * @summary Convert kebab-case string to camelCase string.
 * @param {string} kebabCaseString - Input kebab-case string.
 * @param {boolean} isUpper - Should return string be in UpperCamelCase?
 * @param {boolean} isSpaced - Should return string replace hyphens with
 *      whitespace characters?
 * @returns {string} camelCase string version of input.
 */
export function toCamelCase(kebabCaseString: string, isUpper?: boolean, isSpaced?: boolean): string;
/**
 * Convert camelCaseString to kebab-case-string, adding hyphens between words.
 * If input string includes spaces (for example the verbatim title of a
 * markdown documentation file), replace with hyphens - this is good for
 * converting a title string to a valid kebab-case-filename. Option also
 * available for generating Upper-Kebab-Case strings.
 *
 * @summary Convert camelCaseString to kebab-case-string.
 * @param {string} camelCaseString - Input camelCaseString.
 * @param {boolean} isUpper - Should return string be in Upper-Kebab-Case?
 * @returns {string} kebab-case-string version of input.
 */
export function toKebabCase(camelCaseString: string, isUpper?: boolean): string;
