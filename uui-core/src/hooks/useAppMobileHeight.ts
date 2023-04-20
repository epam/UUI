import { useEffect } from 'react';

export const useAppMobileHeight = () => {
    useEffect(() => {
        const setMobileHeight = () => {
            const height = `${window.innerHeight}px`;
            document.documentElement.style.setProperty('--app-mobile-height', height);
        };

        setMobileHeight();
        window.addEventListener('resize', setMobileHeight);

        return () => {
            window.removeEventListener('resize', setMobileHeight);
        };
    }, []);
};
