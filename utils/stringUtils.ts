/**
 * String manipulation utilities
 */

/**
 * Convert a string to Title Case (first letter of each word capitalized)
 * @param str - Input string
 * @returns Title case string
 * @example titleCase("hello world") // "Hello World"
 */
export const toTitleCase = (str: string): string => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Convert a string to Sentence Case (only first letter of first word capitalized)
 * @param str - Input string
 * @returns Sentence case string
 * @example sentenceCase("HELLO WORLD") // "Hello world"
 */
export const toSentenceCase = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert a string to Lowercase
 * @param str - Input string
 * @returns Lowercase string
 * @example toLowerCase("Hello World") // "hello world"
 */
export const toLowerCase = (str: string): string => {
    if (!str) return '';
    return str.toLowerCase();
};

/**
 * Convert a string to Uppercase
 * @param str - Input string
 * @returns Uppercase string
 * @example toUpperCase("Hello World") // "HELLO WORLD"
 */
export const toUpperCase = (str: string): string => {
    if (!str) return '';
    return str.toUpperCase();
};