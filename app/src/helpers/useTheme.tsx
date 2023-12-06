import { useState, useEffect } from 'react';
import { useUuiContext } from '@epam/uui-core';
import { getCurrentTheme } from './';
import { TTheme } from '../common/docs/docsConstants';

export const useTheme = () => {
    const { uuiRouter } = useUuiContext();
    const [theme, setTheme] = useState<TTheme>(getCurrentTheme());

    const toggleTheme = (newTheme: TTheme) => {
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
    };

    // Apply the current theme to the body element
    useEffect(() => {
        const { pathname, query } = uuiRouter.getCurrentLink();
        const currentTheme = document.body.classList.value.match(/uui-theme-(\S+)\s*/)[0];
        document.body.classList.replace(currentTheme, `uui-theme-${theme}`);
        uuiRouter.redirect({ pathname: pathname, query: { ...query, theme: theme } });
    }, [theme]);

    return {
        theme,
        toggleTheme,
    };
};
