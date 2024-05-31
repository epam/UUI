import { getQuery, useQuery } from './getQuery';
import { BuiltInTheme, Theme } from '../data';
import { getUuiThemeRoot } from './appRootUtils';
import { overrideSettings } from '@epam/uui';
import { CustomThemeManifest } from '../data/customThemes';
import { IRouterContext, useUuiContext } from '@epam/uui-core';
import { useEffect } from 'react';

export type TThemeConfig = {
    themes: string[];
    themesById: Record<string, CustomThemeManifest | Theme>;
};
export type TAppThemeContext = TThemeConfig & { theme: string, toggleTheme: (newTheme: string) => void };

const QUERY_PARAM_THEME = 'theme';
const LOCAL_STORAGE_THEME_ITEM_ID = 'app-theme';
const DEFAULT_THEME = BuiltInTheme.loveship;

export const getCurrentTheme = (): string => {
    return getQuery(QUERY_PARAM_THEME) || getInitialThemeFallback();
};

export function useCurrentTheme(config: TThemeConfig | undefined) {
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

export function changeThemeQueryParam(nextTheme: string, uuiRouter: IRouterContext) {
    const { pathname, query, ...restParams } = uuiRouter.getCurrentLink();
    uuiRouter.transfer({ pathname: pathname, query: { ...query, theme: nextTheme }, ...restParams });
}

export function applyTheme(theme: string, config: TThemeConfig) {
    setThemeCssClass(theme);
    saveThemeIdToLocalStorage(theme);
    overrideSettings((config.themesById[theme] as CustomThemeManifest).settings);
}

function getInitialThemeFallback() {
    return localStorage.getItem(LOCAL_STORAGE_THEME_ITEM_ID) || DEFAULT_THEME;
}

function saveThemeIdToLocalStorage(theme: string) {
    localStorage.setItem(LOCAL_STORAGE_THEME_ITEM_ID, theme);
}

function setThemeCssClass(theme: string) {
    const themeRoot = getUuiThemeRoot();
    const currentTheme = themeRoot.classList.value.match(/uui-theme-(\S+)\s*/)[0].trim();
    themeRoot.classList.replace(currentTheme, `uui-theme-${theme}`);
}
