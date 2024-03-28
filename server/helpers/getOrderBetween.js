const { trimEnd } = require('lodash');

function getOrderBetween(inputA, inputB) {
    // => uui utils
    const radix = 36;
    const aValue = inputA == null ? '0' : inputA;
    const a = trimEnd(aValue, '0');
    const b = trimEnd(inputB || 'z', '0');

    const throwError = () => {
        throw new Error(`getOrderBetween: can't find values between ${inputA} and ${inputB}`);
    };

    if (a >= b) {
        throwError();
    }

    let result = '';
    let n = 0;

    while (true) {
        const aChar = a[n];
        const bChar = b[n];
        let defaultAChar = 'a';
        if (inputA == null || bChar == null || bChar < 'a') {
            defaultAChar = '0';
        }
        const aDigit = parseInt(aChar || defaultAChar, radix);
        const bDigit = parseInt(bChar || 'z', radix);

        const midDigit = Math.floor((aDigit + bDigit) / 2);
        result += midDigit.toString(radix);

        if (aDigit !== midDigit) {
            break;
        }

        n++;
    }

    return result;
}

module.exports = {
    getOrderBetween,
};
