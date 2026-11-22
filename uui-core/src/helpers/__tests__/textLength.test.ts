import { getTextLength, limitTextLength, splitTextToCharacters } from '../textLength';

describe('textLength', () => {
    describe('getTextLength', () => {
        it('should count plain text characters', () => {
            expect(getTextLength('Hello')).toBe(5);
        });

        it('should return 0 for empty values', () => {
            expect(getTextLength('')).toBe(0);
            expect(getTextLength(null)).toBe(0);
            expect(getTextLength(undefined)).toBe(0);
        });

        it('should count emoji as a single character', () => {
            expect('😊'.length).toBe(2);
            expect(getTextLength('😊')).toBe(1);
            expect(getTextLength('Hi 😊!')).toBe(5);
        });

        it('should count complex emoji and combined characters as a single character', () => {
            expect(getTextLength('👨‍👩‍👧')).toBe(1); // ZWJ sequence
            expect(getTextLength('👍🏽')).toBe(1); // emoji with skin tone modifier
            expect(getTextLength('🇮🇳')).toBe(1); // flag
            expect(getTextLength('é')).toBe(1); // e + combining acute accent
        });
    });

    describe('splitTextToCharacters', () => {
        it('should split text into user-perceived characters', () => {
            expect(splitTextToCharacters('a😊b👨‍👩‍👧')).toEqual(['a', '😊', 'b', '👨‍👩‍👧']);
        });
    });

    describe('limitTextLength', () => {
        it('should return text as is, if it does not exceed max length', () => {
            expect(limitTextLength('Short', 5)).toBe('Short');
            expect(limitTextLength('😊😊😊', 3)).toBe('😊😊😊');
        });

        it('should cut the end of the text, if previous text is not passed', () => {
            expect(limitTextLength('This is a long text', 5)).toBe('This ');
        });

        it('should not split emoji', () => {
            expect(limitTextLength('😊😊😊😊', 3)).toBe('😊😊😊');
            expect(limitTextLength('ab👨‍👩‍👧cd', 3)).toBe('ab👨‍👩‍👧');
        });

        it('should cut only the inserted text and keep the rest of the text', () => {
            // typed 'x' in the middle of the text, which is already at the limit
            expect(limitTextLength('abxcde', 5, 'abcde')).toBe('abcde');
            // pasted 'xyz' in the middle, when there is space for 1 character only
            expect(limitTextLength('abxyzcd', 5, 'abcd')).toBe('abxcd');
            // added emoji at the end, when there is space for 1 character
            expect(limitTextLength('abcd😊', 5, 'abcd')).toBe('abcd😊');
            expect(limitTextLength('abcd😊😊', 5, 'abcd')).toBe('abcd😊');
        });

        it('should replace selected text with the inserted one within the limit', () => {
            // 'cd' was selected and replaced with 'xyz'
            expect(limitTextLength('abxyze', 5, 'abcde')).toBe('abxye');
        });

        it('should not cut the text, which was longer than the limit before the change (e.g. while deleting characters)', () => {
            expect(limitTextLength('abcdef', 5, 'abcdefg')).toBe('abcdef');
        });
    });

    describe('without Intl.Segmenter support', () => {
        const originalSegmenter = (Intl as any).Segmenter;

        afterEach(() => {
            (Intl as any).Segmenter = originalSegmenter;
        });

        it('should count characters by code points', () => {
            delete (Intl as any).Segmenter;

            jest.isolateModules(() => {
                const { getTextLength: getTextLengthWithoutSegmenter } = require('../textLength');
                expect(getTextLengthWithoutSegmenter('😊')).toBe(1);
                expect(getTextLengthWithoutSegmenter('Hi 😊!')).toBe(5);
            });
        });
    });
});
