import { IThemeVar, TValueByThemeValue } from './sharedTypes';

export enum TThemeVarUiErr {
    VAR_ABSENT= 'VAR_ABSENT',
    VALUE_MISMATCHED = 'VALUE_MISMATCHED'
}

export type IThemeVarUIError = { type: TThemeVarUiErr, message: string };
export type IThemeVarUI = Omit<IThemeVar, 'valueByTheme'> & {
    value: {
        /**
         * The actual value retrieved from the browser for the theme which is actually selected.
         */
        actual: string,
        /**
         * The expected value defined in Figma for the current theme.
         * It's undefined if absent in Figma.
         */
        expected: TValueByThemeValue[keyof TValueByThemeValue] | undefined,
        /**
         * Validation errors
         */
        errors: IThemeVarUIError[],
    }
};

export enum TExpectedValueType {
    direct= 'direct',
    chain= 'chain'
}

export enum COL_NAMES {
    path = 'path',
    cssVar = 'cssVar',
    description = 'description',
    useCases = 'useCases',
    actualValue = 'actualValue',
    expectedValue = 'expectedValue',
    status = 'status',
    index = 'index'
}
export enum STATUS_FILTER {
    all= 'All',
    ok= 'OK',
    absent = 'Absent',
    mismatched = 'Mismatched'
}

export type TTokensFilter = {
    status: STATUS_FILTER | undefined,
};
export type TTotals = Record<STATUS_FILTER, number>;
