import { PropExample } from '../../../types';
import React from 'react';
import { Button } from '@epam/uui';

const TEXT_EXAMPLES = {
    SHORT_TEXT: 'Hello, World!',
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
            value: TEXT_EXAMPLES.SHORT_TEXT,
            ...(isFirstDefault ? { isDefault: true } : {}),
        },
        { name: 'Long text', value: TEXT_EXAMPLES.LONG_TEXT },
        { name: 'Long word', value: TEXT_EXAMPLES.LONG_WORD },
    ];
}

export function getReactNodeExamples(text: string = 'Some text'): PropExample<any>[] {
    return [
        { name: `<i>${text}</i>`, value: (<i>{text}</i>) },
        { name: 'short text', value: TEXT_EXAMPLES.SHORT_TEXT },
        { name: 'long text', value: TEXT_EXAMPLES.LONG_TEXT },
        { name: '123', value: 123 },
        { name: 'null', value: null },
    ];
}

export function getComponentExamples(): PropExample<any>[] {
    return [
        {
            name: 'Component with short text',
            value: () => (<i>{TEXT_EXAMPLES.SHORT_TEXT}</i>),
        },
        {
            name: 'Component with long text',
            value: () => (<i>{TEXT_EXAMPLES.LONG_TEXT}</i>),
        },
        {
            name: 'Button (with short text)',
            value: () => (<Button caption={ TEXT_EXAMPLES.SHORT_TEXT } onClick={ () => {} } />),
        },
    ];
}
