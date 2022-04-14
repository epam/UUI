export const isValueWithinRange = (value: number, array: [number, number]) => {
    return value >= array[0] && value <= array[1];
};