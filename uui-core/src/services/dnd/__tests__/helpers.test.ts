import { getSector } from '../helpers';

/**
 * Enum representing the 8 sectors of a circle.
 * Sectors are numbered clockwise starting from top (0).
 */
enum Sector {
    /** Top position (x=0, y negative) */
    Top = 0,
    /** Top-right position (positive x, negative y) */
    TopRight = 1,
    /** Right position (x positive, y=0) */
    Right = 2,
    /** Bottom-right position (positive x, positive y) */
    BottomRight = 3,
    /** Bottom position (x=0, y positive) */
    Bottom = 4,
    /** Bottom-left position (negative x, positive y) */
    BottomLeft = 5,
    /** Left position (x negative, y=0) */
    Left = 6,
    /** Top-left position (negative x, negative y) */
    TopLeft = 7
}

describe('getSector', () => {
    it('should return sector 0 for top position (x=0, y negative)', () => {
        expect(getSector(0, -1)).toBe(Sector.Top);
        expect(getSector(0, -100)).toBe(Sector.Top);
    });

    it('should return sector 1 for top-right position (x positive, y negative)', () => {
        expect(getSector(1, -1)).toBe(Sector.TopRight);
        expect(getSector(100, -100)).toBe(Sector.TopRight);
    });

    it('should return sector 2 for right position (x positive, y=0)', () => {
        expect(getSector(1, 0)).toBe(Sector.Right);
        expect(getSector(100, 0)).toBe(Sector.Right);
    });

    it('should return sector 2 for bottom-right position (x positive, y positive)', () => {
        expect(getSector(1, 1)).toBe(Sector.Right);
        expect(getSector(100, 100)).toBe(Sector.Right);
    });

    it('should return sector 4 for bottom position (x=0, y positive)', () => {
        expect(getSector(0, 1)).toBe(Sector.Bottom);
        expect(getSector(0, 100)).toBe(Sector.Bottom);
    });

    it('should return sector 4 for bottom-left position (x negative, y positive)', () => {
        expect(getSector(-1, 1)).toBe(Sector.Bottom);
        expect(getSector(-100, 100)).toBe(Sector.Bottom);
    });

    it('should return sector 6 for left position (x negative, y=0)', () => {
        expect(getSector(-1, 0)).toBe(Sector.Left);
        expect(getSector(-100, 0)).toBe(Sector.Left);
    });

    it('should return sector 7 for top-left position (x negative, y negative)', () => {
        expect(getSector(-1, -1)).toBe(Sector.TopLeft);
        expect(getSector(-100, -100)).toBe(Sector.TopLeft);
    });

    it('should handle very small edge cases at boundaries', () => {
        expect(getSector(0.0001, -0.0001)).toBe(Sector.TopRight);
        expect(getSector(0.0001, 0.0001)).toBe(Sector.Right);
        expect(getSector(-0.0001, 0.0001)).toBe(Sector.Bottom);
        expect(getSector(-0.0001, -0.0001)).toBe(Sector.TopLeft);
    });

    it('should handle large coordinate values', () => {
        expect(getSector(1000000, -1000000)).toBe(Sector.TopRight);
        expect(getSector(-1000000, 1000000)).toBe(Sector.Bottom);
    });

    it('should return values in range 0-7', () => {
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            const sector = getSector(x, y);
            expect(sector).toBeGreaterThanOrEqual(Sector.Top);
            expect(sector).toBeLessThan(8);
        }
    });

    it('should be consistent for same angle with different magnitudes', () => {
        expect(getSector(1, -1)).toBe(getSector(10, -10));
        expect(getSector(-1, 1)).toBe(getSector(-10, 10));
        expect(getSector(1, 1)).toBe(getSector(100, 100));
    });
});
