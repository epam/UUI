import * as React from 'react';

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
    const resizeObserver = React.useRef<ResizeObserver>();

    function shouldHaveRightShadow(root: UseScrollShadowsProps['root']) {
        if (!root) return false;
        const { scrollLeft, clientWidth, scrollWidth } = root;
        return scrollWidth - clientWidth - scrollLeft > 1 && !horizontal.right;
    }

    function shouldNotHaveRightShadow(root: UseScrollShadowsProps['root']) {
        const { scrollLeft, clientWidth, scrollWidth } = root;
        return scrollWidth - clientWidth - scrollLeft <= 1 && horizontal.right;
    }

    function shouldHaveLeftShadow(root: UseScrollShadowsProps['root']) {
        if (!root) return false;
        return root.scrollLeft > 0 && !horizontal.left;
    }

    function shouldNotHaveLeftShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollLeft === 0 && horizontal.left;
    }

    function shouldHaveTopShadow(root: UseScrollShadowsProps['root']) {
        if (!root) return false;
        return root.scrollTop > 0 && !vertical.top;
    }

    function shouldNotHaveTopShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollTop === 0 && vertical.top;
    }

    function shouldHaveBottomShadow(root: UseScrollShadowsProps['root']) {
        if (!root) return false;
        const { scrollHeight, scrollTop, clientHeight } = root;
        return scrollHeight - clientHeight - scrollTop > 1 && !vertical.bottom;
    }

    function shouldNotHaveBottomShadow(root: UseScrollShadowsProps['root']) {
        if (!root) return false;
        const { scrollHeight, scrollTop, clientHeight } = root;
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
        root, vertical, horizontal, setVertical, setHorizontal,
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
