import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState<string>(localStorage.getItem('app-theme') || 'uui-theme-promo');

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
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
