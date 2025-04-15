import * as React from 'react';
import { getDir } from '../helpers';

interface UseScrollShadowsProps {
    root?: HTMLElement;
}

interface UseScrollShadowsApi {
    verticalTop: boolean;
    verticalBottom: boolean;
    horizontalLeft: boolean;
    horizontalRight: boolean;
}

export function useScrollShadows({ root }: UseScrollShadowsProps): UseScrollShadowsApi {
    const [vertical, setVertical] = React.useState({ top: false, bottom: false });
    const [horizontal, setHorizontal] = React.useState({ left: false, right: false });
    const resizeObserver = React.useRef<ResizeObserver>(undefined);

    const isRtl = getDir() === 'rtl';
    const rtlMultiplier = isRtl ? -1 : 1;

    function shouldHaveRightShadow(rootRight: UseScrollShadowsProps['root']) {
        if (!rootRight) return false;
        const { scrollLeft, clientWidth, scrollWidth } = rootRight;
        return scrollWidth - clientWidth - scrollLeft * rtlMultiplier > 1 && !horizontal.right;
    }

    function shouldNotHaveRightShadow(rootRight: UseScrollShadowsProps['root']) {
        const { scrollLeft, clientWidth, scrollWidth } = rootRight;
        return scrollWidth - clientWidth - scrollLeft * rtlMultiplier <= 1 && horizontal.right;
    }

    function shouldHaveLeftShadow(rootLeft: UseScrollShadowsProps['root']) {
        if (!rootLeft) return false;
        return rootLeft.scrollLeft * rtlMultiplier > 0 && !horizontal.left;
    }

    function shouldNotHaveLeftShadow(rootLeft: UseScrollShadowsProps['root']) {
        return rootLeft.scrollLeft === 0 && horizontal.left;
    }

    function shouldHaveTopShadow(rootTop: UseScrollShadowsProps['root']) {
        if (!rootTop) return false;
        return rootTop.scrollTop > 0 && !vertical.top;
    }

    function shouldNotHaveTopShadow(rootTop: UseScrollShadowsProps['root']) {
        return rootTop.scrollTop === 0 && vertical.top;
    }

    function shouldHaveBottomShadow(rootBottom: UseScrollShadowsProps['root']) {
        if (!rootBottom) return false;
        const { scrollHeight, scrollTop, clientHeight } = rootBottom;
        return scrollHeight - clientHeight - scrollTop > 1 && !vertical.bottom;
    }

    function shouldNotHaveBottomShadow(rootBottom: UseScrollShadowsProps['root']) {
        if (!rootBottom) return false;
        const { scrollHeight, scrollTop, clientHeight } = rootBottom;
        return scrollHeight - clientHeight - scrollTop <= 1 && vertical.bottom;
    }

    const updateScrollShadows = React.useCallback(() => {
        if (!root) return;

        // Horizontal shadow states
        if (shouldHaveLeftShadow(root)) setHorizontal({ ...horizontal, left: true });
        else if (shouldNotHaveLeftShadow(root)) setHorizontal({ ...horizontal, left: false });
        else if (shouldHaveRightShadow(root)) setHorizontal({ ...horizontal, right: true });
        else if (shouldNotHaveRightShadow(root)) setHorizontal({ ...horizontal, right: false });

        // Vertical shadow states
        if (shouldHaveTopShadow(root)) setVertical({ ...vertical, top: true });
        else if (shouldNotHaveTopShadow(root)) setVertical({ ...vertical, top: false });
        else if (shouldHaveBottomShadow(root)) setVertical({ ...vertical, bottom: true });
        else if (shouldNotHaveBottomShadow(root)) setVertical({ ...vertical, bottom: false });
    }, [
        root, vertical, horizontal, setVertical, setHorizontal, isRtl,
    ]);

    React.useEffect(() => {
        if (!root) return;
        root.addEventListener('scroll', updateScrollShadows);
        return () => root.removeEventListener('scroll', updateScrollShadows);
    }, [
        root, horizontal, setHorizontal, vertical, setVertical,
    ]);

    React.useEffect(() => {
        if (!root) return;
        resizeObserver.current = new ResizeObserver((entries) => {
            requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) return;
                updateScrollShadows();
            });
        });
        resizeObserver.current.observe(root);
        return () => resizeObserver.current.disconnect();
    }, [root, resizeObserver.current]);

    React.useEffect(() => {
        if (!root) return;
        window.addEventListener('resize', updateScrollShadows);
        return () => window.removeEventListener('resize', updateScrollShadows);
    }, [updateScrollShadows, root]);

    return {
        verticalTop: vertical.top || shouldHaveTopShadow(root),
        verticalBottom: vertical.bottom || shouldHaveBottomShadow(root),
        horizontalLeft: horizontal.right || shouldHaveRightShadow(root),
        horizontalRight: horizontal.left || shouldHaveLeftShadow(root),
    };
}
