import { useState, useEffect } from 'react';
import { useUuiContext } from '@epam/uui-core';
import { TUUITheme } from '../common/docs/BaseDocsBlock';

export const useTheme = () => {
    const { uuiRouter } = useUuiContext();
    const [theme, setTheme] = useState<TUUITheme>(
        uuiRouter.getCurrentLink().query['theme'] || (localStorage.getItem('app-theme') as TUUITheme) || 'uui-theme-loveship',
    );

    const toggleTheme = (newTheme: TUUITheme) => {
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
    };

    // Apply the current theme to the body element
    useEffect(() => {
        const { pathname, query } = uuiRouter.getCurrentLink();
        const currentTheme = document.body.classList.value.match(/uui-theme-(\S+)\s*/)[0];
        document.body.classList.replace(currentTheme, theme);
        uuiRouter.redirect({ pathname: pathname, query: { ...query, theme: theme } });
    }, [theme]);

    return {
        theme,
        toggleTheme,
    };
};
