import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CustomThemeManifest, loadCustomThemes } from '../data/customThemes';
import { builtInThemes, ThemeBaseParams } from '../data';
import { ThemeId } from '@epam/uui-docs';
import { changeThemeQueryParam, overrideUuiSettings, saveThemeIdToLocalStorage,
    setThemeCssClass, TAppThemeContext, ThemesConfig, useCurrentTheme,
} from './appThemeUtils';
import { useUuiContext } from '@epam/uui-core';
import { Blocker } from '@epam/uui';

const AppThemeContext = React.createContext<TAppThemeContext>(null);
export function useAppThemeContext() {
    return useContext(AppThemeContext);
}

export function AppTheme(props: { children: React.ReactNode }) {
    const { uuiRouter } = useUuiContext();
    const [appliedTheme, setAppliedTheme] = useState<ThemeId | null>(null);
    const config = useThemeConfig();
    /**
     * The query parameter "theme" is a single source of truth.
     * Therefore, if theme needs to be changed, it MUST be changed ONLY in query param.
     */
    const theme = useCurrentTheme(config);
    useEffect(() => {
        if (theme && config && appliedTheme !== theme) {
            applyTheme(theme);
        }
    }, [appliedTheme, config, theme]);

    function applyTheme(newTheme: ThemeId) {
        const nextThemeConfig = config.themesById[newTheme];

        if (!nextThemeConfig) {
            reportUnknownThemeError(theme);
            return;
        }
        setThemeCssClass(newTheme);
        saveThemeIdToLocalStorage(newTheme);
        overrideUuiSettings((nextThemeConfig as CustomThemeManifest).settings);
        changeThemeQueryParam(nextThemeConfig, uuiRouter);

        setAppliedTheme(newTheme);
    }

    const value = useMemo(() => {
        if (theme && config && appliedTheme) {
            return {
                ...config,
                theme,
                toggleTheme: (nextTheme: ThemeId) => {
                    applyTheme(nextTheme);
                },
            };
        }
        return null;
    }, [appliedTheme, applyTheme, config, theme]);

    const renderChildren = () => {
        if (!value) {
            return <Blocker isEnabled />;
        }
        return props.children;
    };

    return (
        (
            <AppThemeContext value={ value }>
                { renderChildren() }
            </AppThemeContext>
        )
    );
}

function useThemeConfig() {
    const [config, setConfig] = useState<ThemesConfig | null>(null);
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

async function loadListOfThemes(): Promise<ThemesConfig> {
    const customThemesArr = await loadCustomThemes();
    const allThemes = [...builtInThemes, ...customThemesArr];
    const themesById = allThemes.reduce<Record<string, ThemeBaseParams | CustomThemeManifest>>((acc, t) => {
        acc[t.id] = t;
        return acc;
    }, {});
    return {
        themes: Object.keys(themesById),
        themesById,
    };
}

function reportUnknownThemeError(theme: ThemeId) {
    console.error(`[appTheme] Theme "${theme}" is unknown`);
}
