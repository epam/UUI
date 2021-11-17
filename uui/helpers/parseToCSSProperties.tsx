export function parseStringToCSSProperties(styles: string) {
    const parsedStyle: any = {};
    if (styles) {
        styles.split(';').map((item: any) => {
            let [name, value] = item.trim().split(':');
            parsedStyle[name] = !name || overwritingStyles.includes(name)
                ? null
                : value.trim();
        });
    }
    return parsedStyle;
}

const overwritingStyles = [
    "background-color", "font-family", "font-style",  
];