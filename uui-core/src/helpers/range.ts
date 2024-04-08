function* rangeFromTo(start: number, end: number, step: number = 1) {
    for (let i = start; i < end; i = i + step) {
        yield i;
    }
}

function* reverseRangeFromTo(start: number, end: number, step: number = 1) {
    for (let i = start; i > end; i = i - step) {
        yield i;
    }
}

function* rangeGen(start: number, end?: number, step: number = 1) {
    if (end === undefined) {
        yield* rangeFromTo(0, start, step);
    }

    if (start < end) {
        yield* rangeFromTo(start, end, step);
    } else {
        yield* reverseRangeFromTo(start, end, step);
    }
}

export const range = (start: number, end?: number, step: number = 1) =>
    Array.from(rangeGen(start, end, step));
