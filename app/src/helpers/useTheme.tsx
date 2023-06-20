import * as React from 'react';

export const useTheme = (className: string = '') => {
    const rootEl = document.querySelector('body');
    const prevThemeClass = React.useRef(null);

    React.useEffect(() => {
        prevThemeClass.current = [...rootEl.classList].find((val) => val.includes('uui-theme'));

        if (prevThemeClass.current) {
            rootEl.classList.replace(prevThemeClass.current, className);
        } else {
            rootEl.classList.add(className);
        }
        return () => {
            if (prevThemeClass.current) {
                rootEl.classList.replace(className, prevThemeClass.current);
            } else {
                rootEl.classList.remove(className);
            }
        };
    }, [className]);
};
