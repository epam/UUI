import { getQuery, useQuery } from './getQuery';
import { BuiltInTheme, ThemeBaseParams, ThemesList } from '../data';
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

export type ThemeConfig = CustomThemeManifest | ThemeBaseParams;

export type ThemesConfig = {
    themes: ThemesList[];
    themesById: Record<ThemesList, ThemeConfig>;
};
export type TAppThemeContext = ThemesConfig & { theme: ThemesList, toggleTheme: (newTheme: ThemesList) => void };

const QUERY_PARAM_THEME = 'theme';
const LOCAL_STORAGE_THEME_ITEM_ID = 'app-theme';
const DEFAULT_THEME = BuiltInTheme.loveship;

export const getCurrentTheme = (): ThemesList => {
    return getQuery(QUERY_PARAM_THEME) || getInitialThemeFallback();
};

export function useCurrentTheme(config: ThemesConfig | undefined): ThemesList | undefined {
    const { uuiRouter } = useUuiContext();
    const param = useQuery(QUERY_PARAM_THEME);
    const theme = param ? param : getInitialThemeFallback();

    useEffect(() => {
        if (config && !config.themesById[theme]) {
            console.error(`[useCurrentTheme] Theme "${theme}" is unknown. Redirecting to default theme "${DEFAULT_THEME}"`);
            changeThemeQueryParam(config.themesById[DEFAULT_THEME], uuiRouter);
        }
    }, [config, theme, uuiRouter]);

    if (config?.themesById[theme]) {
        return theme;
    }
}

const isCustomThemeConfig = (theme: ThemeConfig): theme is CustomThemeManifest => (theme as CustomThemeManifest).path !== undefined;

export function changeThemeQueryParam(nextTheme: ThemeConfig, uuiRouter: IRouterContext) {
    const { pathname, query, ...restParams } = uuiRouter.getCurrentLink();
    const newQuery = { ...query, theme: nextTheme.id };
    if (isCustomThemeConfig(nextTheme)) {
        newQuery.themePath = nextTheme.path;
    }
    uuiRouter.transfer({ pathname: pathname, query: newQuery, ...restParams });
}

export function applyTheme(theme: ThemesList, config: ThemesConfig) {
    setThemeCssClass(theme);
    saveThemeIdToLocalStorage(theme);
    overrideUuiSettings((config.themesById[theme] as CustomThemeManifest).settings);
}

function getInitialThemeFallback() {
    return localStorage.getItem(LOCAL_STORAGE_THEME_ITEM_ID) || DEFAULT_THEME;
}

function saveThemeIdToLocalStorage(theme: ThemesList) {
    localStorage.setItem(LOCAL_STORAGE_THEME_ITEM_ID, theme);
}

function setThemeCssClass(theme: ThemesList) {
    const themeRoot = getUuiThemeRoot();
    const currentTheme = themeRoot.classList.value.match(/uui-theme-(\S+)\s*/)[0].trim();
    themeRoot.classList.replace(currentTheme, `uui-theme-${theme}`);
}
