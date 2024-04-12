import { useLayoutEffectSafeForSsr } from '@epam/uui-core';

export function usePreviewPageBg() {
    useLayoutEffectSafeForSsr(() => {
        const style = document.body.style;
        const prev = style.backgroundColor;
        style.backgroundColor = 'var(--uui-surface-main)';
        return () => {
            style.backgroundColor = prev;
        };
    }, []);
}
