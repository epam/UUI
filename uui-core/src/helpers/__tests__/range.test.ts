import { range } from '../range';

describe('range', () => {
    it('should generate a sequence with a specific step in ascending order', () => {
        expect(range(2, 10, 2)).toEqual([2, 4, 6, 8]);
    });

    it('should generate a sequence with default step in ascending order', () => {
        expect(range(2, 10)).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should generate a sequence with default step in ascending order, if only end bound is specified', () => {
        expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should generate a sequence with default step in descending order, if only end bound is specified and end bound is negative', () => {
        expect(range(-5)).toEqual([0, -1, -2, -3, -4]);
    });

    it('should generate a sequence with a specific step in descending order', () => {
        expect(range(5, -5, -2)).toEqual([5, 3, 1, -1, -3]);
    });

    it('should generate a sequence with step = 0', () => {
        expect(range(1, 10, 0)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1]);
        expect(range(10, 1, 0)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
});
