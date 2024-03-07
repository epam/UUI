import { useState, useEffect } from 'react';
import { useUuiContext } from '@epam/uui-core';
import { getCurrentTheme } from './';
import { TTheme } from '../common/docs/docsConstants';
import { setThemeCssClass } from './appRootUtils';

export const useTheme = () => {
    const { uuiRouter } = useUuiContext();
    const [theme, setTheme] = useState<TTheme>(getCurrentTheme());

    const toggleTheme = (newTheme: TTheme) => {
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
    };

    // Apply the current theme to the body element
    useEffect(() => {
        const { pathname, query, ...restParams } = uuiRouter.getCurrentLink();
        setThemeCssClass(theme);
        uuiRouter.transfer({ pathname: pathname, query: { ...query, theme: theme }, ...restParams });
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
    }, []);

    return {
        theme,
        toggleTheme,
    };
};
