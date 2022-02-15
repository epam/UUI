import trimEnd from 'lodash.trimend';

export function getOrderBetween(inputA: string | null, inputB: string | null): string { // => uui utils
    const radix = 36;
    let a = trimEnd(inputA || '0', '0');
    let b = trimEnd(inputB || 'z', '0');

    const throwError = () => { throw new Error(`getOrderBetween: can't find values between ${inputA} and ${inputB}`); };

    if (a >= b) {
        throwError();
    }

    let result = '';
    let n = 0;

    while (true) {
        const aChar = a[n];
        const bChar = b[n];
        const aDigit = parseInt(aChar || '0', radix);
        const bDigit = parseInt(bChar || 'z', radix);

        const midDigit = Math.floor((aDigit + bDigit) / 2);
        result += midDigit.toString(radix);

        if (aDigit != midDigit) {
            break;
        }

        n++;
    }

    return result;
}