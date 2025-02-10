export type HTMLDir = 'rtl' | 'ltr';

export function getDir(): HTMLDir {
    if (typeof window !== 'undefined') {
        return window.document.dir as HTMLDir;
    }

    return 'ltr';
}
