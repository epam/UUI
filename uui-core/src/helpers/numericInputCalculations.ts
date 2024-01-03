type CalculatedDTO = {
    value: number | null;
    step?: number;
    action?: 'incr' | 'decr';
};

type ValidationDTO = {
    value: number;
    min?: number;
    max?: number;
};

export const getMinMaxValidatedValue = ({ value, min = 0, max = Number.MAX_SAFE_INTEGER }: ValidationDTO): number => {
    if (value > max) {
        return max;
    } else if (value < min) {
        return min;
    } else {
        return value;
    }
};

export const getCalculatedValue = ({ value: initialValue, step = 1, action = 'incr' }: CalculatedDTO): number => {
    const value = initialValue || 0;
    const valueDecimalLength = getDecimalLength(value);
    const stepDecimalLength = getDecimalLength(step);
    const decimalLength = valueDecimalLength >= stepDecimalLength ? valueDecimalLength : stepDecimalLength;

    let adjustedValue = value;
    switch (action) {
        case 'decr':
            adjustedValue = value - step;
            break;
        case 'incr':
            adjustedValue = value + step;
            break;
        default:
            return 0;
    }
    return Number(adjustedValue.toFixed(decimalLength));
};

export const getDecimalLength = (value: number | null): number => {
    const splitedValue = String(value).split('.');
    if (splitedValue.length === 1) return 0;
    return splitedValue[1].length;
};

export const getSeparatedValue = (value: number | null, formatOptions: Intl.NumberFormatOptions = {}, locale?: string): string | null => {
    if (!value && value !== 0) return null;
    return value.toLocaleString(locale, formatOptions);
};
