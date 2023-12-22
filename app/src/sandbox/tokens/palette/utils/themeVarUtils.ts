import { IThemeVarUI, TExpectedValueType, TThemeVarUiErr } from '../types/types';
import { TTheme } from '../../../../common/docs/docsConstants';
import { IThemeVar, TFigmaThemeName, TResolvedValueNorm, TVarType } from '../types/sharedTypes';
import { normalizeHex } from './colorUtils';

export const THEME_MAP: Record<TTheme, TFigmaThemeName | undefined> = {
    [TTheme.electric]: TFigmaThemeName.EPAM,
    [TTheme.promo]: TFigmaThemeName.PROMO,
    [TTheme.loveship]: TFigmaThemeName.LOVESHIP_LIGHT,
    [TTheme.loveship_dark]: TFigmaThemeName.LOVESHIP_DARK,
    [TTheme.vanilla_thunder]: undefined,
};

export function getExpectedValue(params: { themeVar: IThemeVarUI, expectedValueType: TExpectedValueType }): TResolvedValueNorm | undefined {
    const { expectedValueType, themeVar } = params;
    const theme = params.themeVar.valueCurrent.theme;
    return getExpectedValueByTheme({ expectedValueType, themeVar, theme });
}

export function getExpectedValueByTheme(params: { themeVar: IThemeVar, theme: TTheme, expectedValueType: TExpectedValueType }): TResolvedValueNorm | undefined {
    const figmaTheme = THEME_MAP[params.theme];
    if (figmaTheme) {
        return params.themeVar.valueByTheme[figmaTheme][params.expectedValueType === TExpectedValueType.direct ? 'valueDirect' : 'valueChain'];
    }
}

function isEqualValue(params: { actual: string, token: IThemeVar, theme: TTheme, expectedValueType: TExpectedValueType }) {
    const { actual, theme, token, expectedValueType } = params;
    const expected = getExpectedValueByTheme({ theme, themeVar: token, expectedValueType });

    if (expected !== undefined) {
        if (token.type === TVarType.COLOR) {
            const expectedNorm = normalizeHex(expected.value as string);
            const actualNorm = normalizeHex(actual);
            return expectedNorm.localeCompare(actualNorm) === 0;
        }
        return String(expected.value) === actual;
    }
    return true;
}

export function validateActualTokenValue(
    params: { actual: string, theme: TTheme, token: IThemeVar, expectedValueType: TExpectedValueType },
): IThemeVarUI['valueCurrent']['errors'] {
    //
    const { actual, theme, token, expectedValueType } = params;
    const errors: IThemeVarUI['valueCurrent']['errors'] = [];
    if (actual === '') {
        errors.push({
            type: TThemeVarUiErr.VAR_ABSENT,
            message: `CSS variable ${token.cssVar} is not defined`,
        });
    } else if (!isEqualValue({ token, actual, theme, expectedValueType })) {
        errors.push({
            type: TThemeVarUiErr.VALUE_MISMATCHED,
            message: 'Actual value doesn\'t match expected value',
        });
    }
    return errors;
}
