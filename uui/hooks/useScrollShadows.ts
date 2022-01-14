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

    const updateHorizontalShadows = (scrollTop: number) => {
        console.log({ scrollTop });
        if (scrollTop > 0 && !vertical.active) {
            setVertical({ active: true })
        } else if (scrollTop === 0 && vertical.active) {
            setVertical({ active: false });
        } else return;
    };

    const updateVerticalShadows = ({
        scrollWidth,
        clientWidth,
        scrollLeft
    }: {
        scrollWidth: number,
        clientWidth: number,
        scrollLeft: number
    }) => {
        if (scrollLeft > 0 && !horizontal.left) {
            setHorizontal({ ...horizontal, left: true });
        } else if (scrollLeft === 0 && horizontal.left) {
            setHorizontal({ ...horizontal, left: false });
        } else if (scrollLeft > 0 && scrollWidth - clientWidth - scrollLeft > 1 && !horizontal.right) {
            setHorizontal({ ...horizontal, right: true });
        } else if (scrollWidth - clientWidth - scrollLeft <= 1 && horizontal.right) {
            setHorizontal({ ...horizontal, right: false });
        } else return;
    };

    useLayoutEffect(() => {
        if (!root) return;

        const updateScrollShadows = (e: Event) => {
            const { scrollWidth, clientWidth, scrollLeft, scrollTop } = e.currentTarget as HTMLElement;
            updateHorizontalShadows(scrollTop);
            updateVerticalShadows({ scrollWidth, clientWidth, scrollLeft });
        };

        root.addEventListener('scroll', updateScrollShadows);
        return () => root.removeEventListener('scroll', updateScrollShadows);
    }, [root, horizontal, setHorizontal, vertical, setVertical]);

    return {
        vertical: vertical.active,
        horizontalLeft: horizontal.right,
        horizontalRight: horizontal.left,
    };
};