export function isPropValueEmpty(propValue: unknown): boolean {
    return propValue === undefined;
}

export function stringifyUnknown(value: unknown) {
    if (!isPropValueEmpty(value)) {
        const isArr = Array.isArray(value);
        const isObject = !isArr && typeof value === 'object';
        let effective: string | number | boolean = '';
        if (isArr || isObject) {
            try { effective = JSON.stringify(value, undefined, 1); } catch {}
        } else if (['number', 'boolean', 'string'].indexOf(typeof value) !== -1) {
            effective = value as (string | number | boolean);
        }
        return effective;
    }
}
