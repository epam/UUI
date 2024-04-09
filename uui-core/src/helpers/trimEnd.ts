/**
 *
 * Function, which removes specific char from the end of the string.
 * @param str - string, the end of which should be trimmed.
 * @param charToTrim - a single char, which should be trimmed from the end of the string.
 * If no char is passed, default `string.trimEnd` behavior is executed.
 * @returns - trimmed string.
 * @internal
 */
export function trimEnd(str: string, charToTrim?: string) {
    if (!charToTrim) {
        return str.trimEnd();
    }

    let end = str.length - 1;
    while (end >= 0 && str[end] === charToTrim) {
        end--;
    }

    if (end < 0) {
        return '';
    }

    return str.substring(0, end + 1);
}
