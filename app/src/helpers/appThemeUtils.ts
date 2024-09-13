import { getQuery, useQuery } from './getQuery';
import { BuiltInTheme, ThemeBaseParams, ThemeId } from '../data';
import { getUuiThemeRoot } from './appRootUtils';
import { Settings, settings } from '@epam/uui';
import { CustomThemeManifest } from '../data/customThemes';
import { IRouterContext, useUuiContext } from '@epam/uui-core';
import { useEffect } from 'react';

/**
 * Override settings. Pass undefined in order to reset to default settings.
 * @param newSettings
 */
export const overrideUuiSettings = ((_defaultSettings: string) => (newSettings: object | undefined) => {
    if (newSettings) {
        Object.assign(settings.sizes, (newSettings as Settings).sizes);
    } else {
        Object.assign(settings, JSON.parse(_defaultSettings));
    }
})(JSON.stringify(settings));

export type ThemeConfig = CustomThemeManifest | ThemeBaseParams;

export type ThemesConfig = {
    themes: ThemeId[];
    themesById: Record<ThemeId, ThemeConfig>;
};
export type TAppThemeContext = ThemesConfig & { theme: ThemeId, toggleTheme: (newTheme: ThemeId) => void };

const QUERY_PARAM_THEME = 'theme';
const LOCAL_STORAGE_THEME_ITEM_ID = 'app-theme';
const DEFAULT_THEME = BuiltInTheme.loveship;

export const getCurrentTheme = (): ThemeId => {
    return getQuery(QUERY_PARAM_THEME) || getInitialThemeFallback();
};

export function useCurrentTheme(config: ThemesConfig | undefined): ThemeId | undefined {
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

export const isCustomThemeConfig = (theme: ThemeConfig): theme is CustomThemeManifest => (theme as CustomThemeManifest).path !== undefined;

export function changeThemeQueryParam(nextTheme: ThemeConfig, uuiRouter: IRouterContext) {
    const { pathname, query, ...restParams } = uuiRouter.getCurrentLink();
    const newQuery = { ...query, theme: nextTheme.id };
    if (isCustomThemeConfig(nextTheme)) {
        newQuery.themePath = nextTheme.path;
    }
    uuiRouter.transfer({ pathname: pathname, query: newQuery, ...restParams });
}

function getInitialThemeFallback() {
    return localStorage.getItem(LOCAL_STORAGE_THEME_ITEM_ID) || DEFAULT_THEME;
}

export function saveThemeIdToLocalStorage(theme: ThemeId) {
    localStorage.setItem(LOCAL_STORAGE_THEME_ITEM_ID, theme);
}

export function setThemeCssClass(theme: ThemeId) {
    const themeRoot = getUuiThemeRoot();
    const currentTheme = themeRoot.classList.value.match(/uui-theme-(\S+)\s*/)[0].trim();
    themeRoot.classList.replace(currentTheme, `uui-theme-${theme}`);
}
