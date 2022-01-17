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
    const resizeObserver = React.useRef<MutationObserver>();

    function shouldHaveRightShadow(root: UseScrollShadowsProps['root']) {
        const { scrollLeft, clientWidth, scrollWidth } = root;
        return scrollWidth - clientWidth - scrollLeft > 1 && !horizontal.right;
    }

    function shouldNotHaveRightShadow(root: UseScrollShadowsProps['root']) {
        const { scrollLeft, clientWidth, scrollWidth } = root;
        return scrollWidth - clientWidth - scrollLeft <= 1 && horizontal.right;
    }

    function shouldHaveLeftShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollLeft > 0 && !horizontal.left;
    }

    function shouldNotHaveLeftShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollLeft === 0 && horizontal.left;
    }

    function shouldHaveVerticalShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollTop > 0 && !vertical.active;
    }

    function shouldNotHaveVerticalShadow(root: UseScrollShadowsProps['root']) {
        return root.scrollTop === 0 && vertical.active;
    }

    function updateScrollShadows() {
        // Horizontal shadow states
        if (shouldHaveLeftShadow(root)) setHorizontal({ ...horizontal, left: true });
        else if (shouldNotHaveLeftShadow(root)) setHorizontal({ ...horizontal, left: false });
        else if (shouldHaveRightShadow(root)) setHorizontal({ ...horizontal, right: true });
        else if (shouldNotHaveRightShadow(root)) setHorizontal({ ...horizontal, right: false });

        // Vertical shadow states
        if (shouldHaveVerticalShadow(root)) setVertical({ ...vertical, active: true });
        else if (shouldNotHaveVerticalShadow(root)) setVertical({ ...vertical, active: false });
    }

    React.useEffect(() => {
        if (!root) return;
        root.addEventListener('scroll', updateScrollShadows);
        return () => root.removeEventListener('scroll', updateScrollShadows);
    }, [root, horizontal, setHorizontal, vertical, setVertical]);

    React.useEffect(() => {
        if (!root) return;
        resizeObserver.current = new MutationObserver(updateScrollShadows);
        resizeObserver.current.observe(root, { attributes: true, attributeFilter: ['width', 'height', 'scrollWidth']});
        return () => root && resizeObserver.current.disconnect();
    }, [root]);

    return {
        vertical: vertical.active,
        horizontalLeft: horizontal.right || root && shouldHaveRightShadow(root),
        horizontalRight: horizontal.left || root && shouldHaveLeftShadow(root),
    };
};