/**
 * Replace commas with newlines in a string
 * @param text - The input string to process
 * @returns String with commas replaced by newlines
 */
export const replaceCommasWithNewlines = (text: string): string => {
    return text.split(',').join('\n');
};

export const addLineAfterCommas = (text: string): string => {
    return text.replace(/,/g, ',\n');
};