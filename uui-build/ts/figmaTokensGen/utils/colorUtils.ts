import { TRgbaValue } from '../types/sourceTypes';
import { THexaValue } from '../types/sharedTypes';

export function rgbaToHEXA({ r, g, b, a }: TRgbaValue): THexaValue {
    const h = (n: number) => {
        return ((n * 255) | (1 << 8)).toString(16).slice(1);
    };
    const arr = [h(r), h(g), h(b)];
    if (a !== 1) {
        arr.push(h(a));
    }
    return `#${arr.join('').toUpperCase()}`;
}
