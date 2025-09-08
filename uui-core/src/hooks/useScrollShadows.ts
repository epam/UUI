import * as React from 'react';
import { getDir } from '../helpers';

const scrollMarkers = {
    scrolledLeft: '-scrolled-left',
    scrolledRight: '-scrolled-right',
    scrolledTop: '-scrolled-top',
    scrolledBottom: '-scrolled-bottom',
};

export function useScrollShadows(root: HTMLElement | null, view: HTMLElement | null) {
    const rtlMultiplier = getDir() === 'rtl' ? -1 : 1;

    const updateScrollShadows = React.useCallback(() => {
        if (!root || !view) return;

        const {
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight,
        } = view;

        const normalizedScrollLeft = scrollLeft * rtlMultiplier;

        // console.log('scrollLeft', scrollLeft, 'normalizedScrollLeft', normalizedScrollLeft, 'scrollTop', scrollTop, 'scrollWidth', scrollWidth, 'clientWidth', clientWidth);

        root.classList.toggle(
            scrollMarkers.scrolledRight,
            normalizedScrollLeft > 0,
        );

        // console.log('scrollWidth - clientWidth - normalizedScrollLeft', scrollWidth - clientWidth - normalizedScrollLeft);

        root.classList.toggle(
            scrollMarkers.scrolledLeft,
            scrollWidth - clientWidth - normalizedScrollLeft > 1,
        );

        root.classList.toggle(
            scrollMarkers.scrolledTop,
            scrollTop > 0,
        );

        root.classList.toggle(
            scrollMarkers.scrolledBottom,
            scrollHeight - clientHeight - scrollTop > 1,
        );
    }, [root]);

    React.useEffect(() => {
        if (!root || !view) return;

        updateScrollShadows();

        const handleScroll = () => updateScrollShadows();
        view.addEventListener('scroll', handleScroll, { passive: true });

        const resizeObserver = new ResizeObserver(updateScrollShadows);
        resizeObserver.observe(view);

        const handleResize = () => updateScrollShadows();
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            view.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [root, updateScrollShadows]);
}
