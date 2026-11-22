interface GraphemeSegmenter {
    segment: (text: string) => Iterable<{ segment: string }>;
}

type GraphemeSegmenterConstructor = new (locales?: string, options?: { granularity: 'grapheme' }) => GraphemeSegmenter;

let graphemeSegmenter: GraphemeSegmenter | null | undefined;

function getGraphemeSegmenter(): GraphemeSegmenter | null {
    if (graphemeSegmenter === undefined) {
        // Intl.Segmenter isn't available in old browsers (e.g. Firefox < 125). Also, it's not a part of ES2021 typings.
        const Segmenter = (Intl as unknown as { Segmenter?: GraphemeSegmenterConstructor }).Segmenter;
        graphemeSegmenter = Segmenter ? new Segmenter(undefined, { granularity: 'grapheme' }) : null;
    }
    return graphemeSegmenter;
}

/**
 * Splits text into user-perceived characters (grapheme clusters).
 * Unlike `text.split('')`, it doesn't split emoji and other characters, which consist of several UTF-16 code units,
 * e.g. '😊' or '👨‍👩‍👧' is a single character.
 * If `Intl.Segmenter` isn't supported by the browser, text is split by Unicode code points.
 * @param text - text to split
 * @returns array of characters
 */
export function splitTextToCharacters(text: string | null | undefined): string[] {
    if (!text) {
        return [];
    }

    const segmenter = getGraphemeSegmenter();
    return segmenter
        ? Array.from(segmenter.segment(text), ({ segment }) => segment)
        : Array.from(text);
}

/**
 * Returns the count of user-perceived characters in the text.
 * Unlike `text.length`, it counts emoji and other characters, which consist of several UTF-16 code units, as a single character,
 * e.g. `getTextLength('😊')` returns 1, while `'😊'.length` is 2.
 * @param text - text to count characters in
 * @returns count of characters
 */
export function getTextLength(text: string | null | undefined): number {
    return splitTextToCharacters(text).length;
}

/**
 * Limits the length of the text, counting user-perceived characters (see `getTextLength`).
 * If `prevText` is passed, only the part inserted into `prevText` is cut, and the rest of the text is kept,
 * the same way as native `maxlength` attribute works, when user types or pastes text in the middle of the input.
 * @param text - new text, e.g. input value after change
 * @param maxLength - max count of characters
 * @param prevText - text before change, e.g. input value before change
 * @returns text which doesn't exceed `maxLength`, or the text as is, if it's not longer than before the change
 */
export function limitTextLength(text: string, maxLength: number, prevText: string = ''): string {
    const chars = splitTextToCharacters(text);
    if (maxLength == null || chars.length <= maxLength) {
        return text;
    }

    const prevChars = splitTextToCharacters(prevText);

    // Find the part of the text, which was inserted/replaced, comparing new text with previous one from both sides.
    let start = 0;
    while (start < prevChars.length && start < chars.length && prevChars[start] === chars[start]) {
        start++;
    }

    let end = 0;
    while (
        end < prevChars.length - start
        && end < chars.length - start
        && prevChars[prevChars.length - 1 - end] === chars[chars.length - 1 - end]
    ) {
        end++;
    }

    const inserted = chars.slice(start, chars.length - end);
    const availableLength = Math.max(0, maxLength - start - end);

    return [
        ...chars.slice(0, start),
        ...inserted.slice(0, availableLength),
        ...chars.slice(chars.length - end),
    ].join('');
}
