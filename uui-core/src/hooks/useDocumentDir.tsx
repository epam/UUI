import { useState, useEffect } from 'react';
import { getDir, HTMLDir } from '../helpers';

export function useDocumentDir(): HTMLDir {
    const [dir, setDir] = useState<HTMLDir>(getDir());

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
                    setDir(getDir());
                }
            });
        });

        observer.observe(document?.documentElement, { attributes: true });

        return () => {
            observer.disconnect();
        };
    }, []);

    return dir;
}
