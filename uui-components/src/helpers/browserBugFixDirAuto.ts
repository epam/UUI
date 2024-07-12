function isLTR(char: string) {
    const ltrRegex = /[A-Za-z]/;
    return ltrRegex.test(char);
}

function isRTL(char: string) {
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return rtlRegex.test(char);
}

export function browserBugFixDirAuto(text: string) {
    // temporary solution to fix this issue https://github.com/whatwg/html/issues/4903
    for (const char of text) {
        if (isRTL(char)) return 'rtl';
        if (isLTR(char)) return 'ltr';
    }
    return 'ltr'; // Default to LTR if no strong directionality found
}
