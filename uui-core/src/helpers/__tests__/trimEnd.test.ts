import { trimEnd } from '../trimEnd';

describe('trimEnd', () => {
    it('should remove chars from the end', () => {
        expect(trimEnd('aaaaa0', '0')).toBe('aaaaa');
    });

    it('should remove multiple chars from the end', () => {
        expect(trimEnd('aaaaa00000', '0')).toBe('aaaaa');
    });

    it('should return full string if no zero at the end', () => {
        expect(trimEnd('aaaaa000001', '0')).toBe('aaaaa000001');
        expect(trimEnd('aaaaa00000 ', '0')).toBe('aaaaa00000 ');
    });

    it('should return empty string if all chars in list are zeroes', () => {
        expect(trimEnd('00000', '0')).toBe('');
    });

    it('should return empty string if empty string is passed to the argumentse', () => {
        expect(trimEnd('', '0')).toBe('');
    });
});
