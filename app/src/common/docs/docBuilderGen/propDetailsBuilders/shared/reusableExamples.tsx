import { PropExample } from '@epam/uui-docs';

export function getReactRefExamples(name: string): PropExample<any> {
    return (ctx: any) => {
        return [
            {
                name: 'React.createRef<any>()',
                value: {
                    set current(p: any) {
                        const cb = ctx.getCallback(`${name}.current = `);
                        cb(p);
                    },
                },
            },
            ctx.getCallback(name),
        ];
    };
}

export function getRawPropsExamples(): PropExample<any>[] {
    return [
        { name: 'style', value: { style: { border: '3px solid red' } } },
        { name: 'data-attr', value: { 'data-attr': 'Some value here' } },
    ];
}
export function getTextExamplesNoUndefined(isFirstDefault?: boolean): PropExample<any>[] {
    return [
        {
            value: 'Short text',
            ...(isFirstDefault ? { isDefault: true } : {}),
        },
        { name: 'Long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'Long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ];
}
