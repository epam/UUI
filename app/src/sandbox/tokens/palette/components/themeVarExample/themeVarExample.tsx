import { TVarType } from '../../types/sharedTypes';
import React from 'react';
import { ColorRectangle } from '../colorRectangle/colorRectangle';
import { IThemeVarUI, TExpectedValueType } from '../../types/types';
import { getExpectedValue } from '../../utils/themeVarUtils';

type TThemeVarExampleProps = { themeVar: IThemeVarUI, } & ({ mode: 'showActual' } | { mode: 'showExpected', expectedValueType: TExpectedValueType });

export function ThemeVarExample(props: TThemeVarExampleProps) {
    const { themeVar, mode } = props;

    switch (themeVar.type) {
        case TVarType.COLOR: {
            if (mode === 'showExpected') {
                const expected = getExpectedValue({ themeVar, expectedValueType: props.expectedValueType });
                return (
                    <ColorRectangle color={ expected.value as string } hex={ `${expected.value}` } />
                );
            }

            const actual = `var(${themeVar.cssVar})`;
            return (
                <ColorRectangle color={ actual } hex={ `${themeVar.valueCurrent.value}` } />
            );
        }
        case TVarType.FLOAT: {
            if (mode === 'showExpected') {
                const expected = getExpectedValue({ themeVar, expectedValueType: props.expectedValueType });
                return <div>{expected.value}</div>;
            }
            return <div>{themeVar.valueCurrent.value}</div>;
        }
        default: {
            return null;
        }
    }
}
