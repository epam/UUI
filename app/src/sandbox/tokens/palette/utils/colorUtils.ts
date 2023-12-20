import { THexaValue } from '../types/sharedTypes';

export function colorToHex(color: string): THexaValue {
    const isRgba = color.startsWith('rgb');
    if (isRgba) {
        const commaSeparated = color.replace(/(rgb[a]?\()([0-9\s,.]+)(\))/g, '$2');
        const [r, g, b, a] = commaSeparated.split(',').map((s) => Number(s.trim()));
        const h = (n: number) => {
            return (n | (1 << 8)).toString(16).slice(1).toUpperCase();
        };
        const arr3 = [h(r), h(g), h(b)];
        if (a !== undefined) {
            arr3.push(h(a));
        }
        return `#${arr3.join('')}`;
    }
    return color as THexaValue;
}
