function rangeFromTo(start: number, end: number, step?: number) {
    const defaultStepForRange = (end >= start) ? 1 : -1;

    return Array.from({ length: (end - start) / (step || defaultStepForRange) }, (_, index) => {
        if (step === 0) {
            return 1;
        }

        return start + (index * (step ?? defaultStepForRange));
    });
}

/**
 * Factory of numeric sequences with the exact step.
 * @param start - a start number of the sequence inclusively.
 * @param end - an end number of the sequence exclusively.
 * @param step - step of the progression. Defaults:
 * - if start <= end, step = 1
 * - if start > end, step = -1.
 * @returns a sequence of numbers in progression, described by bounds with a specific step.
 */
export function range(start: number, end?: number, step?: number) {
    if (end === undefined) {
        return rangeFromTo(0, start, step);
    }

    return rangeFromTo(start, end, step);
}
