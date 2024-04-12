import { PropDocPropsUnknown } from '@epam/uui-docs';

export function formatPropsForNativeTooltip(inputValues: PropDocPropsUnknown) {
    let propsForDataAttr = '';
    let propsForTooltip = '';
    try {
        propsForDataAttr = JSON.stringify(inputValues, undefined, 1);
        propsForTooltip = Object.keys(inputValues).sort().reduce((acc, name, i) => {
            const value = inputValues[name] as any;
            if (value !== undefined) {
                const lb = i === 0 ? '' : '\n';
                let v = JSON.stringify(value);
                if (v === undefined || v === '{}') {
                    v = value.name || '...';
                }
                return acc + lb + `${name} = ${v}`;
            }
            return acc;
        }, '');
    } catch (err) {
        console.error(err);
    }

    return {
        propsForTooltip,
        propsForDataAttr,
    };
}
