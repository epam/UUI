import { Theme, builtInThemes } from './themes';

export interface AppContext {
    themes: Theme[],
    themesById: Record<string, Theme>,
}

interface AppSettings {
    customThemes: Theme[],
}

export async function getAppContext() {
    const settingsResponse = await fetch('/static/settings.json');
    const settings = await settingsResponse.json() as AppSettings;

    // Support for custom theme development.
    // Custom themes can be declared in /static/settings.json file, and will be loaded dynamically.
    // We also use proxies to add this file from repositories with custom themes.
    const customThemes = settings.customThemes ?? [];
    customThemes.forEach((theme) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = theme.cssUrl!;
        document.head.appendChild(link);
    });

    const allThemes = [...builtInThemes, ...settings.customThemes ?? []];

    const appContext = {
        themes: allThemes,
        themesById: Object.fromEntries(allThemes.map((t) => [t.id, t])),
    };

    return appContext;
}
