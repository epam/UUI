import React from 'react';
import { TVarType } from '../../types/sharedTypes';
import { ColorRectangle } from '../colorRectangle/colorRectangle';
import { IThemeVarUI } from '../../types/types';

type TTokenExampleProps = { token: IThemeVarUI, mode: 'showActual' | 'showExpected' };

export function TokenExample(props: TTokenExampleProps) {
    const { token, mode } = props;

    switch (token.type) {
        case TVarType.COLOR: {
            if (mode === 'showExpected') {
                const expected = token.value.expected;
                if (expected === undefined) {
                    return null;
                }
                return (
                    <ColorRectangle color={ expected.value as string } hex={ `${expected.value}` } />
                );
            }

            const actual = `var(${token.cssVar})`;
            return (
                <ColorRectangle color={ actual } hex={ `${token.value.actual}` } />
            );
        }
        case TVarType.FLOAT: {
            if (mode === 'showExpected') {
                const expected = token.value.expected;
                if (expected === undefined) {
                    return null;
                }
                return <div>{expected.value}</div>;
            }
            return <div>{token.value.actual}</div>;
        }
        default: {
            return null;
        }
    }
}
