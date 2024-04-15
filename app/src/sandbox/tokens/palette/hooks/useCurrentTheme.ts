import { getCurrentTheme } from '../../../../helpers';
import { useEffect, useState } from 'react';
import { getUuiThemeRoot } from '../../../../helpers/appRootUtils';

export function useCurrentTheme(): string {
    const [theme, setTheme] = useState<string>(() => getCurrentTheme());

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                setTheme(getCurrentTheme());
            });
        });
        const themeRoot = getUuiThemeRoot();
        observer.observe(themeRoot, { attributes: true, attributeFilter: ['class'] });
        return () => {
            observer.disconnect();
        };
    }, []);

    return theme;
}
