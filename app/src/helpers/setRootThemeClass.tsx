import * as React from 'react';

export const SetRootThemeClass = (className: string = '') => {
    React.useEffect(() => {
        const rootEl = document.getElementById('root');
        rootEl.setAttribute('class', className);
        return () => {
            const rootClasses = rootEl.getAttribute('class')
                ? rootEl.getAttribute('class').split(' ').filter((v) => v !== className).join(' ')
                : '';
            if (rootClasses.length) {
                rootEl.setAttribute('class', rootClasses);
            } else rootEl.removeAttribute('class');
        };
    }, [className]);
};
