import { IThemeVar, TValueByThemeValue } from './sharedTypes';
import { ThemeId } from '../../../../data';

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
        browser: string,
        /**
         * The expected value defined in Figma for the current theme.
         * It's undefined if absent in Figma.
         */
        figma: TValueByThemeValue[keyof TValueByThemeValue] | undefined,
        /**
         * Validation errors
         */
        errors: IThemeVarUIError[],
    }
};

export interface TLoadThemeTokensParams {
    filter: TLoadThemeTokensFilter,
    valueType: TThemeTokenValueType,
}
export type TLoadThemeTokensResult = {
    tokens: IThemeVarUI[],
    loading: boolean,
    uuiTheme: ThemeId,
};
export interface TLoadThemeTokensFilter {
    path?: string,
    published?: 'yes' | 'no',
}

export enum TThemeTokenValueType {
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
    published = 'published'
}
export enum STATUS_FILTER {
    all= 'All',
    ok= 'OK',
    absent = 'Absent',
    mismatched = 'Mismatched'
}

export type TTokensLocalFilter = {
    status: STATUS_FILTER | undefined,
};
export type TTotals = Record<STATUS_FILTER, number>;

export type ITokenRowGroup = { id: string, _group: true, parentId?: string };
export const isTokenRowGroup = (item: ITokenRow): item is ITokenRowGroup => {
    return (item as ITokenRowGroup)._group !== undefined;
};

export type ITokenRow = (IThemeVarUI & { parentId?: string }) | ITokenRowGroup;
