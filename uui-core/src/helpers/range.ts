function rangeFromTo(start: number, end: number, step?: number) {
    const defaultStepForRange = (end >= start) ? 1 : -1;
    const stepForRangeValues = step ?? defaultStepForRange;

    return Array.from({ length: (end - start) / (step || defaultStepForRange) }, (_, index) => {
        return start + (index * stepForRangeValues);
    });
}

export function range(start: number, end: number, step?: number) {
    if (end === undefined) {
        return rangeFromTo(0, start, step);
    }

    return rangeFromTo(start, end, step);
}
