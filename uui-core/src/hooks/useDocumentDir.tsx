import { useState, useEffect } from 'react';

type Dir = 'rtl' | 'ltr';

export function useDocumentDir(): Dir {
    const [dir, setDir] = useState<Dir>(window?.document.dir as Dir);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
                    setDir(window?.document.dir as Dir);
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
