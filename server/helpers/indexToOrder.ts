const base = 26;
const memoized = [];

/**
 * Computes order string from integer item index in a sequence.
 * Useful for creating initial orders of items, which can be later manipulated with getOrderBetween to insert or move items.
 * @param input integer order of item
 * @returns order string
 */
export function indexToOrder(input) {
    const existing = memoized[input];
    if (existing) {
        return existing;
    }

    const aChar = 97;
    const digits = [];

    let lastInputValue = input;
    while (lastInputValue > 0) {
        digits.unshift((lastInputValue % base) + aChar);
        lastInputValue = Math.floor(lastInputValue / base);
    }
    const order = String.fromCharCode(
        // Put number of digits first, to establish order between numbers
        // of different length (the longer is bigger)
        // We add '+ 1' is to start number of digits from 'b'
        // to leave room to insert orders before numberToOrder(0), w/o using digits.
        digits.length + aChar + 1,
        ...digits,
    );
    memoized[input] = order;
    return order;
}
