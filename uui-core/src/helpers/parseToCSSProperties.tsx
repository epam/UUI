export function parseStringToCSSProperties(styles: string) {
    const parsedStyle: any = {};
    if (styles) {
        styles.split(';').map((item: any) => {
            const [name, value] = item.trim().split(':');
            parsedStyle[name] = !name || erasedStyleProps.includes(name) ? null : value.trim();
        });
    }
    return parsedStyle;
}

const erasedStyleProps = [
    'background-color', 'font-family', 'font-style',
];
