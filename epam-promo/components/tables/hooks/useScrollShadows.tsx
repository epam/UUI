import { MutableRefObject, useRef, useState, useEffect } from "react";

interface UseTableShadowsProps {
    root: Element;
}

interface UseTableShadowsApi {
    vertical: boolean;
    horizontal: boolean;
    horizontalRef: MutableRefObject<HTMLDivElement>;
    verticalRef: MutableRefObject<HTMLDivElement>;
};

export function useTableShadows({ root }: UseTableShadowsProps): UseTableShadowsApi {
    const verticalObserver = useRef<IntersectionObserver>();
    const horizontalObserver = useRef<IntersectionObserver>();
    const verticalRef = useRef<HTMLDivElement>();
    const horizontalRef = useRef<HTMLDivElement>();
    const [vertical, setVertical] = useState(false);
    const [horizontal, setHorizontal] = useState(false);

    useEffect(() => {
        if (!verticalRef.current || !root) return;

        verticalObserver.current = new IntersectionObserver(([{ isIntersecting, boundingClientRect }]) => {
            setVertical(isIntersecting ? boundingClientRect.y < 0 : boundingClientRect.y > 0);
        }, { root });

        verticalObserver.current.observe(verticalRef.current);
        return () => verticalRef.current && verticalObserver.current.unobserve(verticalRef.current);
    }, [verticalRef.current, vertical, root]);

    useEffect(() => {
        if (!horizontalRef.current) return;

        horizontalObserver.current = new IntersectionObserver(([{ isIntersecting, boundingClientRect }]) => {
            setHorizontal(!isIntersecting && boundingClientRect.x < 0);
        }, { threshold: [0.99, 1] });

        horizontalObserver.current.observe(horizontalRef.current);
        return () => horizontalRef.current && horizontalObserver.current.unobserve(horizontalRef.current);
    }, [horizontalRef.current, horizontal]);

    return { vertical, horizontal, horizontalRef, verticalRef };
};