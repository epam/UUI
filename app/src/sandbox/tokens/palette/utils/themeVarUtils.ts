import { IThemeVarUI } from '../types/types';
import { TTheme } from '../../../../common/docs/docsConstants';
import { IThemeVar, TFigmaThemeName } from '../types/sharedTypes';

export const THEME_MAP: Record<TTheme, TFigmaThemeName> = {
    [TTheme.electric]: TFigmaThemeName.EPAM,
    [TTheme.promo]: TFigmaThemeName.PROMO,
    [TTheme.loveship]: TFigmaThemeName.LOVESHIP_LIGHT,
    [TTheme.loveship_dark]: TFigmaThemeName.LOVESHIP_DARK,
    [TTheme.vanilla_thunder]: TFigmaThemeName.EPAM, // TBD
};

export function getExpectedValue(params: { themeVar: IThemeVarUI }) {
    const figmaTheme = THEME_MAP[params.themeVar.valueCurrent.theme];
    return params.themeVar.value[figmaTheme];
}

export function getExpectedValueByTheme(params: { themeVar: IThemeVar, theme: TTheme }) {
    const figmaTheme = THEME_MAP[params.theme];
    return params.themeVar.value[figmaTheme];
}
