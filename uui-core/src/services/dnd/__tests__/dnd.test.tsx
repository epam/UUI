import { getSector } from '../helpers';

describe('dnd', () => {
    describe('helpers', () => {
        it('should compute sector correctly', () => {
            expect(getSector(0.1, -0.4)).toBe(0);
            expect(getSector(0.4, -0.1)).toBe(1);
            expect(getSector(0.4, 0.1)).toBe(2);
            expect(getSector(0.1, 0.4)).toBe(3);
            expect(getSector(-0.1, 0.4)).toBe(4);
            expect(getSector(-0.4, 0.1)).toBe(5);
            expect(getSector(-0.4, -0.1)).toBe(6);
            expect(getSector(-0.1, -0.5)).toBe(7);
            expect(getSector(0, 0)).toBe(2); // any value in 0-7 would work
        });
    });
});
