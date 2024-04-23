import { Theme, builtInThemes } from './themes';
import { CustomThemeManifest, loadCustomThemes } from './customThemes';

export interface AppContext {
    themes: string[],
    themesById: Record<string, Theme | CustomThemeManifest>,
}

export async function getAppContext() {
    const customThemesArr = await loadCustomThemes();
    const allThemes = [...builtInThemes, ...customThemesArr];
    const themesById = allThemes.reduce<Record<string, Theme | CustomThemeManifest>>((acc, t) => {
        acc[t.id] = t;
        return acc;
    }, {});

    return {
        themes: Object.keys(themesById),
        themesById,
    };
}
