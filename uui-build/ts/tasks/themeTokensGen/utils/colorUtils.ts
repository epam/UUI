import { TRgbaValue } from '../types/sourceTypes';

export function rgbaToHEXA({ r, g, b, a }: TRgbaValue): string {
    const h = (n: number) => {
        return ((n * 255) | (1 << 8)).toString(16).slice(1);
    };
    const arr = [h(r), h(g), h(b)];
    if (a !== 1) {
        arr.push(h(a));
    }
    return `#${arr.join('').toUpperCase()}`;
}
