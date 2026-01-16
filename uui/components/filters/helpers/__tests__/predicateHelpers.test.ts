import { isValidRangeValue, isFilledArray, hasSomeNullishProp } from '../predicateHelpers';

describe('isValidRangeValue', () => {
    it('should return true when from is 0', () => {
        expect(isValidRangeValue({ from: 0, to: 100 })).toBeTruthy();
    });

    it('should return true when to is 0', () => {
        expect(isValidRangeValue({ from: -100, to: 0 })).toBeTruthy();
    });

    it('should return true when both from and to are 0', () => {
        expect(isValidRangeValue({ from: 0, to: 0 })).toBeTruthy();
    });

    it('should return true when only from is 0', () => {
        expect(isValidRangeValue({ from: 0 })).toBeTruthy();
    });

    it('should return true when only to is 0', () => {
        expect(isValidRangeValue({ to: 0 })).toBeTruthy();
    });

    it('should return false when both from and to are null', () => {
        expect(isValidRangeValue({ from: null, to: null })).toBeFalsy();
    });

    it('should return false when both from and to are undefined', () => {
        expect(isValidRangeValue({ from: undefined, to: undefined })).toBeFalsy();
    });

    it('should return true when from is null but to has value', () => {
        expect(isValidRangeValue({ from: null, to: 100 })).toBeTruthy();
    });

    it('should return true when to is null but from has value', () => {
        expect(isValidRangeValue({ from: 0, to: null })).toBeTruthy();
    });

    it('should return false when range is null', () => {
        expect(isValidRangeValue(null)).toBeFalsy();
    });

    it('should return false when range is undefined', () => {
        expect(isValidRangeValue(undefined)).toBeFalsy();
    });

    it('should return true with regular numeric values', () => {
        expect(isValidRangeValue({ from: 50000, to: 150000 })).toBeTruthy();
    });

    it('should return true with date string values', () => {
        expect(isValidRangeValue({ from: '2020-01-01', to: '2020-12-31' })).toBeTruthy();
    });

    it('should return true with negative numbers', () => {
        expect(isValidRangeValue({ from: -100, to: -50 })).toBeTruthy();
    });

    it('should return true when only from is provided', () => {
        expect(isValidRangeValue({ from: 50 })).toBeTruthy();
    });

    it('should return true when only to is provided', () => {
        expect(isValidRangeValue({ to: 100 })).toBeTruthy();
    });

    it('should return false when both from and to are missing', () => {
        expect(isValidRangeValue({})).toBeFalsy();
    });
});

describe('isFilledArray', () => {
    it('should return true for non-empty array', () => {
        expect(isFilledArray([1, 2, 3])).toBeTruthy();
        expect(isFilledArray(['a', 'b', 'c'])).toBeTruthy();
        expect(isFilledArray([1])).toBeTruthy();
        expect(isFilledArray([0])).toBeTruthy();
        expect(isFilledArray([0, false, ''])).toBeTruthy();
    });

    it('should return false for empty array', () => {
        expect(isFilledArray([])).toBeFalsy();
    });

    it('should return false for null', () => {
        expect(isFilledArray(null)).toBeFalsy();
    });

    it('should return false for undefined', () => {
        expect(isFilledArray(undefined)).toBeFalsy();
    });

    it('should return false for non-array object', () => {
        expect(isFilledArray({ length: 1 })).toBeFalsy();
    });

    it('should return false for string', () => {
        expect(isFilledArray('array')).toBeFalsy();
    });

    it('should return false for number', () => {
        expect(isFilledArray(123)).toBeFalsy();
    });
});

describe('hasSomeNullishProp', () => {
    it('returns true when at least one prop is nullish', () => {
        expect(hasSomeNullishProp({ a: null, b: ['a', 'b'] })).toBeTruthy();
        expect(hasSomeNullishProp({ a: undefined, b: 5 })).toBeTruthy();
    });

    it('returns false when all props are defined', () => {
        expect(hasSomeNullishProp({ a: 1, b: 0, c: ['a'] })).toBeFalsy();
    });
});
