import { ThemeBaseParams, builtInThemes, TTheme } from './themes';
import { CustomThemeManifest, loadCustomThemes } from './customThemes';
import { DocItem } from '../documents/structure';

export interface AppContext {
    themes: TTheme[],
    themesById: Record<TTheme, ThemeBaseParams | CustomThemeManifest>,
    docsMenuStructure: DocItem[],
}

export async function getThemeContext() {
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
