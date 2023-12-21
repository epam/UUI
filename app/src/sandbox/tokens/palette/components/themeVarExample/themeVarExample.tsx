import { TVarType } from '../../types/sharedTypes';
import React from 'react';
import { ColorRectangle } from '../colorRectangle/colorRectangle';
import { IThemeVarUI } from '../../types/types';
import { getExpectedValue } from '../../utils/themeVarUtils';

export function ThemeVarExample(props: { themeVar: IThemeVarUI, mode: 'showActual' | 'showExpected' }) {
    const { themeVar, mode } = props;

    switch (themeVar.type) {
        case TVarType.COLOR: {
            if (mode === 'showActual') {
                const actual = `var(${themeVar.cssVar})`;
                return (
                    <ColorRectangle color={ actual } hex={ `${themeVar.valueCurrent.value}` } />
                );
            }
            const expected = getExpectedValue({ themeVar });
            return (
                <ColorRectangle color={ expected.value as string } hex={ `${expected.value}` } />
            );
        }
        case TVarType.FLOAT: {
            if (mode === 'showActual') {
                return <div>{themeVar.valueCurrent.value}</div>;
            }
            const expected = getExpectedValue({ themeVar });
            return <div>{expected.value}</div>;
        }
        default: {
            return null;
        }
    }
}
