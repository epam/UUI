import { getCurrentTheme } from '../../../../helpers';
import { TTheme } from '../../../../common/docs/docsConstants';
import { useEffect, useState } from 'react';
import { getUuiThemeRoot } from '../../../../helpers/appRootUtils';

export function useCurrentTheme(): TTheme {
    const [theme, setTheme] = useState<TTheme>(() => getCurrentTheme());

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
