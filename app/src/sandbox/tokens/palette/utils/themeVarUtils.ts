import { IThemeVarUI, TThemeVarUiErr } from '../types/types';
import { TTheme } from '../../../../common/docs/docsConstants';
import { IThemeVar, TFigmaThemeName, TResolvedValueNorm, TVarType } from '../types/sharedTypes';

export const THEME_MAP: Record<TTheme, TFigmaThemeName | undefined> = {
    [TTheme.electric]: TFigmaThemeName.EPAM,
    [TTheme.promo]: TFigmaThemeName.PROMO,
    [TTheme.loveship]: TFigmaThemeName.LOVESHIP_LIGHT,
    [TTheme.loveship_dark]: TFigmaThemeName.LOVESHIP_DARK,
    [TTheme.vanilla_thunder]: undefined,
};

export function getExpectedValue(params: { themeVar: IThemeVarUI }): TResolvedValueNorm | undefined {
    const figmaTheme = THEME_MAP[params.themeVar.valueCurrent.theme];
    return params.themeVar.value[figmaTheme];
}

export function getExpectedValueByTheme(params: { themeVar: IThemeVar, theme: TTheme }): TResolvedValueNorm | undefined {
    const figmaTheme = THEME_MAP[params.theme];
    if (figmaTheme) {
        return params.themeVar.value[figmaTheme];
    }
}

function isEqualValue(params: { actual: string, token: IThemeVar, theme: TTheme }) {
    const { actual, theme, token } = params;
    const expected = getExpectedValueByTheme({ theme, themeVar: token });

    if (expected !== undefined) {
        if (token.type === TVarType.COLOR) {
            return String(expected.value).toUpperCase().localeCompare(actual.toUpperCase()) === 0;
        }
        return String(expected.value) === actual;
    }
    return true;
}

export function validateActualTokenValue(
    params: { actual: string, theme: TTheme, token: IThemeVar },
): IThemeVarUI['valueCurrent']['errors'] {
    //
    const { actual, theme, token } = params;
    const errors: IThemeVarUI['valueCurrent']['errors'] = [];
    if (actual === '') {
        errors.push({
            type: TThemeVarUiErr.VAR_ABSENT,
            message: `CSS variable ${token.cssVar} is not defined`,
        });
    } else if (isEqualValue({ token, actual, theme })) {
        errors.push({
            type: TThemeVarUiErr.VALUE_MISMATCHED,
            message: 'Actual value doesn\'t match expected value',
        });
    }
    return errors;
}
