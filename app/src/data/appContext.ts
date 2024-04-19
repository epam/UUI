import { Theme, builtInThemes, CustomTheme } from './themes';

export interface AppContext {
    themes: string[],
    themesById: Record<string, Theme | CustomTheme>,
}

interface Settings {
    customThemes: CustomTheme[],
}

export async function getAppContext() {
    const settingsResponse = await fetch('/static/settings.json');
    const settings: Settings = await settingsResponse.json();

    // Support for custom theme development.
    // Custom themes can be declared in /static/settings.json file, and will be loaded dynamically.
    // We also use proxies to add this file from repositories with custom themes.
    const customThemes = settings.customThemes ?? [];
    customThemes.forEach((theme) => {
        theme.css.forEach(loadCss);
    });

    const allThemes = [...builtInThemes, ...customThemes];
    const themesById = allThemes.reduce<Record<string, Theme | CustomTheme>>((acc, t) => {
        acc[t.id] = t;
        return acc;
    }, {});

    return {
        themes: Object.keys(themesById),
        themesById,
    };
}

function loadCss(url: string) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.onerror = (...args) => {
        console.error(`Unable to load CSS from "${url}"`, ...args);
        link.remove();
    };
    document.head.appendChild(link);
}
