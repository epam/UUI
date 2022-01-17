import { useState, useLayoutEffect } from "react";

interface UseScrollShadowsProps {
    root?: HTMLElement;
}

interface UseScrollShadowsApi {
    vertical: boolean;
    horizontalLeft: boolean;
    horizontalRight: boolean;
};

export function useScrollShadows({ root }: UseScrollShadowsProps): UseScrollShadowsApi {
    const [vertical, setVertical] = useState({ active: false });
    const [horizontal, setHorizontal] = useState({ left: false, right: false });

    function shouldHaveRightShadow(root: UseScrollShadowsProps['root']) {
        const { scrollLeft, clientWidth, scrollWidth } = root;
        return scrollWidth - clientWidth - scrollLeft > 1;
    }

    function shouldNotHaveRightShadow(root: UseScrollShadowsProps['root']) {
        const { scrollLeft, clientWidth, scrollWidth } = root;
        return scrollWidth - clientWidth - scrollLeft <= 1;
    }

    function shouldHaveLeftShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollLeft > 0;
    }

    function shouldNotHaveLeftShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollLeft === 0;
    }

    function shouldHaveVerticalShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollTop > 0;
    }

    function shouldNotHaveVerticalShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollTop === 0;
    }

    useLayoutEffect(() => {
        if (!root) return;

        const updateScrollShadows = (e: Event) => {
            const table = e.currentTarget as HTMLElement;

            // Horizontal shadow states
            if (shouldHaveLeftShadow(table)) setHorizontal({ ...horizontal, left: true });
            else if (shouldNotHaveLeftShadow(table)) setHorizontal({ ...horizontal, left: false });
            else if (shouldHaveRightShadow(table)) setHorizontal({ ...horizontal, right: true });
            else if (shouldNotHaveRightShadow(table)) setHorizontal({ ...horizontal, right: false });

            // Vertical shadow states
            if (shouldHaveVerticalShadow(table)) setVertical({ ...vertical, active: true });
            else if (shouldNotHaveVerticalShadow(table)) setVertical({ ...vertical, active: false });
        };

        root.addEventListener('scroll', updateScrollShadows);
        return () => root.removeEventListener('scroll', updateScrollShadows);
    }, [root, horizontal, setHorizontal, vertical, setVertical]);

    return {
        vertical: vertical.active,
        horizontalLeft: horizontal.right || root && shouldHaveRightShadow(root),
        horizontalRight: horizontal.left || root && shouldHaveLeftShadow(root),
    };
};