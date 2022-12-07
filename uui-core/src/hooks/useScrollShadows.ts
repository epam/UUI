import * as React from "react";

interface UseScrollShadowsProps {
    root?: HTMLElement;
}

interface UseScrollShadowsApi {
    vertical: boolean;
    horizontalLeft: boolean;
    horizontalRight: boolean;
};

export function useScrollShadows({ root }: UseScrollShadowsProps): UseScrollShadowsApi {
    const [vertical, setVertical] = React.useState({ active: false });
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

    function shouldHaveVerticalShadow(root: UseScrollShadowsProps['root']) {
        if (!root) return false;
        return root.scrollTop > 0 && !vertical.active;
    }

    function shouldNotHaveVerticalShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollTop === 0 && vertical.active;
    }

    const updateScrollShadows = React.useCallback(() => {
        if (!root) return;

        // Horizontal shadow states
        if (shouldHaveLeftShadow(root)) setHorizontal({ ...horizontal, left: true });
        else if (shouldNotHaveLeftShadow(root)) setHorizontal({ ...horizontal, left: false });
        else if (shouldHaveRightShadow(root)) setHorizontal({ ...horizontal, right: true });
        else if (shouldNotHaveRightShadow(root)) setHorizontal({ ...horizontal, right: false });

        // Vertical shadow states
        if (shouldHaveVerticalShadow(root)) setVertical({ ...vertical, active: true });
        else if (shouldNotHaveVerticalShadow(root)) setVertical({ ...vertical, active: false });
    }, [root, vertical, horizontal, setVertical, setHorizontal]);

    React.useEffect(() => {
        if (!root) return;
        root.addEventListener('scroll', updateScrollShadows);
        return () => root.removeEventListener('scroll', updateScrollShadows);
    }, [root, horizontal, setHorizontal, vertical, setVertical]);

    React.useEffect(() => {
        if (!root) return;
        resizeObserver.current = new ResizeObserver(updateScrollShadows);
        resizeObserver.current.observe(root);
        return () => resizeObserver.current.disconnect();
    }, [root, resizeObserver.current]);

    React.useEffect(() => {
        if (!root) return;
        window.addEventListener('resize', updateScrollShadows);
        return () => window.removeEventListener('resize', updateScrollShadows);
    }, [updateScrollShadows, root]);

    return {
        vertical: vertical.active,
        horizontalLeft: horizontal.right || shouldHaveRightShadow(root),
        horizontalRight: horizontal.left || shouldHaveLeftShadow(root),
    };
};