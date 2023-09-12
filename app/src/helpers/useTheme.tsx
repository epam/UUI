import { useState, useEffect, MutableRefObject } from 'react';

export const useTheme = (initialTheme: MutableRefObject<string>) => {
    const [theme, setTheme] = useState<string>(initialTheme.current);

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme);
        initialTheme.current = newTheme;
    };

    // Apply the current theme to the body element
    useEffect(() => {
        const currentTheme = document.body.classList.value.match(/uui-theme-(\S+)\s*/)[0];
        document.body.classList.replace(currentTheme, theme);
    }, [theme]);

    return {
        theme,
        toggleTheme,
    };
};
