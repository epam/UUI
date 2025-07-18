import { PropExample } from '../../../types/types';
import React from 'react';
import { Button, NotificationCard, Text } from '@epam/uui';
import { INotification, UuiContexts } from '@epam/uui-core';

const TEXT_EXAMPLES = {
    SHORT_TEXT: 'Hello, World!',
    LONG_TEXT: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa',
    LONG_WORD: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
};

export function getReactRefExamples(params: { uuiCtx: Pick<UuiContexts, 'uuiNotifications'>, name: string }): PropExample<any>[] {
    const { uuiCtx, name } = params;
    return [
        {
            name: 'React.createRef<any>()',
            value: {
                set current(p: unknown) {
                    const [cb] = getCallbackExample({
                        name: `${name}.current = `,
                        uuiCtx,
                    });
                    cb(p);
                },
            },
        },
        getCallbackExample({ uuiCtx, name })[0],
    ];
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

export function getCallbackExample(params: { uuiCtx: Pick<UuiContexts, 'uuiNotifications'>, name: string }): ((...args: unknown[]) => void)[] {
    const { uuiCtx, name } = params;
    function callbackFn(...args: unknown[]) {
        uuiCtx.uuiNotifications.show(
            (cardProps: INotification) => (<CallbackExampleNotification name={ name } args={ args } cardProps={ cardProps } />),
            { position: 'bot-right' },
        ).catch(() => null);
        // eslint-disable-next-line no-console
        console.log(`[PropertyEditor] ${name} (`, args, ')');
    }
    Object.defineProperty(callbackFn, 'name', { value: 'callback' });
    return [callbackFn];
}

function CallbackExampleNotification(props: { name: string, args: unknown[], cardProps: INotification }) {
    const { name, args, cardProps } = props;
    return (
        <NotificationCard { ...cardProps } color="info">
            <Text>{ `${name} (${args.length} args)` }</Text>
        </NotificationCard>
    );
}
