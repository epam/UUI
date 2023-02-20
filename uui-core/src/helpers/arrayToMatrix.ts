export function arrayToMatrix(array: Array<any>, divider: number) {
    const matrix = [];
    for (let i = 0; i < array.length / divider; i += 1) {
        matrix.push(array.slice(i * divider, (i + 1) * divider));
    }
    return matrix;
}
