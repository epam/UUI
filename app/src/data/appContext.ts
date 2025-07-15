import { ThemeBaseParams, builtInThemes } from './themes';
import { CustomThemeManifest, loadCustomThemes } from './customThemes';
import { DocItem, ThemeId } from '@epam/uui-docs';

export interface AppContext {
    themes: ThemeId[],
    themesById: Record<ThemeId, ThemeBaseParams | CustomThemeManifest>,
    docsMenuStructure: DocItem[],
}

export async function getThemeContext() {
    const customThemesArr = await loadCustomThemes();
    const allThemes = [...builtInThemes, ...customThemesArr];
    const themesById = allThemes.reduce<Record<ThemeId, ThemeBaseParams | CustomThemeManifest>>((acc, t) => {
        acc[t.id] = t;
        return acc;
    }, {});

    return {
        themes: Object.keys(themesById),
        themesById,
    };
}
