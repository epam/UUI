import { IThemeVarUI } from '../types/types';
import { TTheme } from '../../../../common/docs/docsConstants';
import { IThemeVar, TFigmaThemeName, TResolvedValueNorm } from '../types/sharedTypes';

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
