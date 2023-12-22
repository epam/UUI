export function hexToRgb(hex: string | undefined, percents: boolean = false) {
    if (hex) {
        const hex1 = hex.substring(1);
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
    return '';
}

export function normalizeHex(hex: string) {
    if (hex && hex.indexOf('#') === 0) {
        let hex1 = hex.substring(1);
        if (hex1.length === 3) {
            hex1 = [...hex1].reduce((acc, part) => (acc + part + part), '');
        }
        return `#${hex1}`.toUpperCase();
    }
    return hex;
}
