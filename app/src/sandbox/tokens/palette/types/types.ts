import { IThemeVar } from './sharedTypes';
import { TTheme } from '../../../../common/docs/docsConstants';

export enum TThemeVarUiErr {
    VAR_ABSENT= 'VAR_ABSENT',
    VALUE_MISMATCHED = 'VALUE_MISMATCHED'
}
export type IThemeVarUI = IThemeVar & {
    /**
     * The actual value retrieved from the browser for the theme which is actually selected.
     */
    valueCurrent: {
        theme: TTheme,
        value: string,
        errors: { type: TThemeVarUiErr, message: string }[],
    }
};

export enum TExpectedValueType {
    direct= 'direct',
    chain= 'chain'
}
