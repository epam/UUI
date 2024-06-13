import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CustomThemeManifest, loadCustomThemes } from '../data/customThemes';
import { builtInThemes, Theme } from '../data';
import { applyTheme, changeThemeQueryParam, TAppThemeContext, TThemeConfig, useCurrentTheme } from './appThemeUtils';
import { useUuiContext } from '@epam/uui-core';

const AppThemeContext = React.createContext<TAppThemeContext>(null);
export function useAppThemeContext() {
    return useContext(AppThemeContext);
}

export function AppTheme(props: { children: React.ReactNode }) {
    const { uuiRouter } = useUuiContext();
    const [appliedTheme, setAppliedTheme] = useState<string | null>(null);
    const config = useThemeConfig();
    /**
     * The query parameter "theme" is a single source of truth.
     * Therefore, if theme needs to be changed, it MUST be changed ONLY in query param.
     */
    const theme = useCurrentTheme(config);
    useEffect(() => {
        if (theme && config && appliedTheme !== theme) {
            if (!config.themesById[theme]) {
                reportUnknownThemeError(theme);
                return;
            }

            if (isFullReloadNeeded()) {
                window.location.reload();
            } else {
                applyTheme(theme, config);
                setAppliedTheme(theme);
            }

            function isFullReloadNeeded() {
                const isFirstInit = !appliedTheme;
                if (!isFirstInit) {
                    const isPrevThemeHasCustomSetting = !!(config.themesById[appliedTheme] as any)?.settings;
                    const isNextThemeHasCustomSetting = !!(config.themesById[theme] as any)?.settings;
                    if (isPrevThemeHasCustomSetting || isNextThemeHasCustomSetting) {
                        // full reload is needed to correctly render components which depend on "settings.ts"
                        return true;
                    }
                }
            }
        }
    }, [appliedTheme, config, theme]);

    const value = useMemo(() => {
        if (theme && config) {
            return {
                ...config,
                theme,
                toggleTheme: (nextTheme: string) => {
                    if (!config.themesById[nextTheme]) {
                        reportUnknownThemeError(theme);
                        return;
                    }
                    changeThemeQueryParam(nextTheme, uuiRouter);
                },
            };
        }
        return null;
    }, [config, theme, uuiRouter]);

    const renderChildren = () => {
        if (!value) {
            return null;
        }
        return props.children;
    };

    return (
        <AppThemeContext.Provider value={ value }>
            { renderChildren() }
        </AppThemeContext.Provider>
    );
}

function useThemeConfig() {
    const [config, setConfig] = useState<TThemeConfig | null>(null);
    useEffect(() => {
        let destroyed = false;
        loadListOfThemes()
            .then((cfg) => {
                if (destroyed) {
                    return;
                }
                setConfig(cfg);
            })
            .catch((err) => {
                if (destroyed) {
                    return;
                }
                console.error(err);
            });
        return () => {
            destroyed = true;
        };
    }, []);

    return config;
}

async function loadListOfThemes(): Promise<TThemeConfig> {
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

function reportUnknownThemeError(theme: string) {
    console.error(`[appTheme] Theme "${theme}" is unknown`);
}
