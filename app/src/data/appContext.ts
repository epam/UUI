import { ThemeBaseParams, builtInThemes, TTheme } from './themes';
import { CustomThemeManifest, loadCustomThemes } from './customThemes';

export interface AppContext {
    themes: TTheme[],
    themesById: Record<TTheme, ThemeBaseParams | CustomThemeManifest>,
}

export async function getAppContext() {
    const customThemesArr = await loadCustomThemes();
    const allThemes = [...builtInThemes, ...customThemesArr];
    const themesById = allThemes.reduce<Record<TTheme, ThemeBaseParams | CustomThemeManifest>>((acc, t) => {
        acc[t.id] = t;
        return acc;
    }, {});

    return {
        themes: Object.keys(themesById),
        themesById,
    };
}
