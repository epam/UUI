import { getQuery, useQuery } from './getQuery';
import { BuiltInTheme, ThemeBaseParams, TTheme } from '../data';
import { getUuiThemeRoot } from './appRootUtils';
import { settings } from '@epam/uui';
import { CustomThemeManifest } from '../data/customThemes';
import { IRouterContext, useUuiContext } from '@epam/uui-core';
import { useEffect } from 'react';

/**
 * Override settings. Pass undefined in order to reset to default settings.
 * @param newSettings
 */
export const overrideUuiSettings = ((_defaultSettings: string) => (newSettings: object | undefined) => {
    if (newSettings) {
        Object.assign(settings.sizes, (newSettings as { sizes: object }).sizes);
    } else {
        Object.assign(settings, JSON.parse(_defaultSettings));
    }
})(JSON.stringify(settings));

export type TThemeConfig = {
    themes: TTheme[];
    themesById: Record<TTheme, CustomThemeManifest | ThemeBaseParams>;
};
export type TAppThemeContext = TThemeConfig & { theme: TTheme, toggleTheme: (newTheme: TTheme) => void };

const QUERY_PARAM_THEME = 'theme';
const LOCAL_STORAGE_THEME_ITEM_ID = 'app-theme';
const DEFAULT_THEME = BuiltInTheme.loveship;

export const getCurrentTheme = (): TTheme => {
    return getQuery(QUERY_PARAM_THEME) || getInitialThemeFallback();
};

export function useCurrentTheme(config: TThemeConfig | undefined): TTheme | undefined {
    const { uuiRouter } = useUuiContext();
    const param = useQuery(QUERY_PARAM_THEME);
    const theme = param ? param : getInitialThemeFallback();

    useEffect(() => {
        if (config && !config.themesById[theme]) {
            console.error(`[useCurrentTheme] Theme "${theme}" is unknown. Redirecting to default theme "${DEFAULT_THEME}"`);
            changeThemeQueryParam(DEFAULT_THEME, uuiRouter);
        }
    }, [config, theme, uuiRouter]);

    if (config?.themesById[theme]) {
        return theme;
    }
}

export function changeThemeQueryParam(nextTheme: TTheme, uuiRouter: IRouterContext) {
    const { pathname, query, ...restParams } = uuiRouter.getCurrentLink();
    uuiRouter.transfer({ pathname: pathname, query: { ...query, theme: nextTheme }, ...restParams });
}

export function applyTheme(theme: TTheme, config: TThemeConfig) {
    setThemeCssClass(theme);
    saveThemeIdToLocalStorage(theme);
    overrideUuiSettings((config.themesById[theme] as CustomThemeManifest).settings);
}

function getInitialThemeFallback() {
    return localStorage.getItem(LOCAL_STORAGE_THEME_ITEM_ID) || DEFAULT_THEME;
}

function saveThemeIdToLocalStorage(theme: TTheme) {
    localStorage.setItem(LOCAL_STORAGE_THEME_ITEM_ID, theme);
}

function setThemeCssClass(theme: TTheme) {
    const themeRoot = getUuiThemeRoot();
    const currentTheme = themeRoot.classList.value.match(/uui-theme-(\S+)\s*/)[0].trim();
    themeRoot.classList.replace(currentTheme, `uui-theme-${theme}`);
}
