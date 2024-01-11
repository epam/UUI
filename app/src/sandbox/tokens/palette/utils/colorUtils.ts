function rgbToHex(color: string): string {
    const isRgba = color.startsWith('rgb');
    if (isRgba) {
        const commaSeparated = color.replace(/(rgb[a]?\()([0-9\s,.]+)(\))/g, '$2');
        const [r, g, b, a] = commaSeparated.split(',').map((s) => Number(s.trim()));
        const h = (n: number) => {
            return (n | (1 << 8)).toString(16).slice(1).toUpperCase();
        };
        const arr3 = [h(r), h(g), h(b)];
        if (a !== undefined) {
            arr3.push(h(a * 255));
        }
        return `#${arr3.join('')}`;
    }
    return color as string;
}

export function hexToRgb(color: string | undefined, percents: boolean = false) {
    const isHex = color && color.indexOf('#') === 0;
    if (!isHex) {
        return '';
    }
    const hex1 = color.substring(1);
    const r1 = hex1.substring(0, 2);
    const g1 = hex1.substring(2, 4);
    const b1 = hex1.substring(4, 6);
    const a1 = hex1.substring(6, 8);

    const parse16 = (str: string) => {
        const n255 = parseInt(str, 16);
        if (percents) {
            return String(n255 / 255).substring(0, 10);
        }
        return n255;
    };

    const rgb = [
        parse16(r1),
        parse16(g1),
        parse16(b1),
    ];

    if (a1) {
        const parsedInt = parseInt(a1, 16) / 255;
        const parsedStr = parsedInt.toFixed(2);

        const rgba = rgb.concat([
            parseFloat(parsedStr).toString(),
        ]);
        return `${rgba.join(', ')}`;
    }
    return `${rgb.join(', ')}`;
}

/**
 * Returns normalized hex color
 * @param color
 */
export function normalizeColor(color: string) {
    if (color) {
        let colorNorm = color;
        const isHex = colorNorm.indexOf('#') === 0;
        const isRgb = colorNorm.indexOf('rgb') === 0;
        if (isRgb || isHex) {
            if (isRgb) {
                colorNorm = rgbToHex(colorNorm);
            }
            let hex1 = colorNorm.substring(1);
            if (hex1.length === 3) {
                hex1 = [...hex1].reduce((acc, part) => (acc + part + part), '');
            }
            return `#${hex1}`.toUpperCase();
        }
    }
    return color;
}
