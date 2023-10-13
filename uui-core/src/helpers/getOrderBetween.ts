import trimEnd from 'lodash.trimend';

export const minOrderStr = '0';
export const maxOrderStr = 'zzzz';

/**
 * Calculates a string, which is between two strings, if strings are sorted in alphabetic order.
 *
 * Examples:
 *
 *  - 'a', 'z' => 's'
 *  - 'a', 'b' => 'as'
 *  - 'as, 'b' => 'au'
 *  - 'aa, 'ab' => 'aas' // there's no precision limit
 *  - null, 'c' => 'b' // insert first
 *  - 'c', null => 'u' // insert last
 *
 * This approach allows to add order to arbitrary list of items.
 *
 * Any item can be moved to any place in the list by modifying only one attribute. So:
 * - you can save only moved item(s) to server, not the whole list
 * - you can store items in any suitable structure, e.g. - Map<id, Item>, instead of plain arrays
 * - server can trivially update items, as usual fields
 * - server can sort items as well - we use only ASCII 0-9 and a-z, to there's no collation issues
 * - it's better than using integer numbers: no need to renumber items in case you need to insert an item between 1 and 2
 * - it's better than using floats: they can have limited precision, which can lead to complicated issues
 *
 * The function implements a basic average of 2 numbers: (a + b)/2, interpreting strings as fractional part of base-36 number.
 *
 * Read more [here](https://uui.epam.com/documents?id=dragAndDrop&mode=doc&skin=UUI4_promo&category=advanced)
 * @param inputA order string before (can be start for the start of the list)
 * @param inputB order string after (can be null for the end of the list)
 * @returns order string between inputA and inputB
 */
export function getOrderBetween(inputA: string | null, inputB: string | null): string {
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
