export function parseStringToCSSProperties(styles: string) {
    let parsedStyle: any = {};
    if (styles) {
        styles.split(';').map((item: any) => {
            let style = item.trim().split(':');
            style[0] ? parsedStyle[style[0]] = style[1].trim() : null;
        });
    }
    return parsedStyle;
}