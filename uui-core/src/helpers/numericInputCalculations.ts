type calculatedDTO = {
    value: number;
    step?: number;
    action?: 'incr' | 'decr';
};

type validationDTO = {
    value: number;
    min?: number;
    max?: number;
};

export const getMinMaxValidatedValue = ({ value, min = 0, max = Number.MAX_SAFE_INTEGER }: validationDTO): number => {
    if (value > max) {
        return max;
    } else if (value < min) {
        return min;
    } else {
        return value;
    }
};

export const getCalculatedValue = ({ value, step = 1, action = 'incr' }: calculatedDTO): number => {
    let decimalLength = 0;
    const valueDecimalLength = getDecimalLength(value);
    const stepDecimalLength = getDecimalLength(step);
    decimalLength = valueDecimalLength >= stepDecimalLength ? valueDecimalLength : stepDecimalLength;
    let valueToFix = value;
    switch (action) {
        case 'decr':
            valueToFix = value - step;
            break;
        case 'incr':
            valueToFix = value + step;
            break;
        default:
            return;
    }
    return Number(valueToFix.toFixed(decimalLength));
};

export const getDecimalLength = (value: number): number => {
    const splitedValue = String(value).split('.');
    if (splitedValue.length === 1) return 0;
    return splitedValue[1].length;
};

export const getSeparatedValue = (value: number | undefined, formatOptions: Intl.NumberFormatOptions = {}, locale?: string): string | null => {
    if (!value && value !== 0) return null;
    return value.toLocaleString(locale, formatOptions);
};
