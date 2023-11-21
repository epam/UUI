import { PropExample } from '@epam/uui-docs';
import React from 'react';
import { Button } from '@epam/uui';

const STRING_EXAMPLE = {
    SHORT: 'Short text',
    LONG_TEXT: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa',
    LONG_WORD: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
};

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
            value: STRING_EXAMPLE.SHORT,
            ...(isFirstDefault ? { isDefault: true } : {}),
        },
        { name: 'Long text', value: STRING_EXAMPLE.LONG_TEXT },
        { name: 'Long word', value: STRING_EXAMPLE.LONG_WORD },
    ];
}

export function getReactNodeExamples(text: string = 'This is some text'): PropExample<any>[] {
    return [
        { name: `<i>${text}</i>`, value: (<i>{text}</i>) },
        { name: 'short text', value: STRING_EXAMPLE.SHORT },
        { name: 'long text', value: STRING_EXAMPLE.LONG_TEXT },
        { name: 'number', value: 123 },
        { name: 'true', value: true },
        { name: 'false', value: false },
        { name: 'null', value: null },
    ];
}

export function getComponentExamples(): PropExample<any>[] {
    return [
        {
            name: 'Simple component with short text',
            value: () => (<i>{STRING_EXAMPLE.SHORT}</i>),
        },
        {
            name: 'Simple component with long text',
            value: () => (<i>{STRING_EXAMPLE.LONG_TEXT}</i>),
        },
        {
            name: 'Button (with short text)',
            value: () => (<Button caption={ STRING_EXAMPLE.SHORT } onClick={ () => {} } />),
        },
    ];
}
