import { IThemeVar } from './sharedTypes';
import { TTheme } from '../../../../common/docs/docsConstants';

export enum TThemeVarUiErr {
    VAR_IS_ABSENT= 'VAR_IS_ABSENT',
    DIFF_ACTUAL_AND_EXPECTED = 'DIFF_ACTUAL_AND_EXPECTED'
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
