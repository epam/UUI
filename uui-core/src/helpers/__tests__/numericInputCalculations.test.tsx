import {
    getDecimalLength, getCalculatedValue, getMinMaxValidatedValue, getSeparatedValue,
} from '../numericInputCalculations';

describe('numericInputCalculations', () => {
    it('getDecimalLength return length of the decimal value', () => {
        expect(getDecimalLength(null)).toBe(0);

        expect(getDecimalLength(2)).toBe(0);
        expect(getDecimalLength(10)).toBe(0);
        expect(getDecimalLength(100)).toBe(0);

        expect(getDecimalLength(0.123)).toBe(3);
        expect(getDecimalLength(1.25)).toBe(2);
        expect(getDecimalLength(1.3333333333)).toBe(10);
    });

    it('getCalculatedValue return calculated value with default step and action', () => {
        expect(getCalculatedValue({ value: 1.25 })).toBe(2.25);
        expect(getCalculatedValue({ value: 2 })).toBe(3);
        expect(getCalculatedValue({ value: 4.225 })).toBe(5.225);
    });
    it('getCalculatedValue return incremented value with custom step', () => {
        expect(getCalculatedValue({ value: 1.33, step: 0.125 })).toBe(1.455);
        expect(getCalculatedValue({ value: 2, step: 0.01 })).toBe(2.01);
        expect(getCalculatedValue({ value: 4.225, step: 0.3 })).toBe(4.525);
    });
    it('getCalculatedValue return decremented value with custom step', () => {
        expect(getCalculatedValue({ value: 10.33333, step: 0.008, action: 'decr' })).toBe(10.32533);
        expect(getCalculatedValue({ value: 2, step: 1.0026, action: 'decr' })).toBe(0.9974);
        expect(getCalculatedValue({ value: 4.225, step: 0.03, action: 'decr' })).toBe(4.195);
    });

    it('getMinMaxValidatedValue return validated value within min max range', () => {
        expect(getMinMaxValidatedValue({ value: 10, min: 0, max: 10 })).toBe(10);
        expect(getMinMaxValidatedValue({ value: 12, min: 0, max: 10 })).toBe(10);
        expect(getMinMaxValidatedValue({ value: -1, max: 10 })).toBe(0);
    });

    it('getSeparatedValue return validated value within min max range', () => {
        const locale = 'en-EU';
        const formatOptions = {};
        expect(getSeparatedValue(45521, formatOptions, locale)).toBe('45,521');
        expect(getSeparatedValue(1, formatOptions, locale)).toBe('1');
        expect(getSeparatedValue(10000.56, formatOptions, locale)).toBe('10,000.56');
        expect(getSeparatedValue(1.5645514, formatOptions, locale)).toBe('1.565');
        expect(getSeparatedValue(1.5645514, { maximumFractionDigits: 2 }, locale)).toBe('1.56');
        expect(getSeparatedValue(null)).toBe(null);
    });
});
