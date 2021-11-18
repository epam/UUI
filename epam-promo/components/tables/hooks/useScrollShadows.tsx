import { MutableRefObject, useRef, useState, useEffect } from "react";

interface UseTableShadowsApi {
    vertical: boolean;
    horizontal: boolean;
    horizontalRef: MutableRefObject<HTMLDivElement>;
    verticalRef: MutableRefObject<HTMLDivElement>;
};

export function useTableShadows(): UseTableShadowsApi {
    const verticalObserver = useRef<IntersectionObserver>();
    const horizontalObserver = useRef<IntersectionObserver>();
    const verticalRef = useRef<HTMLDivElement>();
    const horizontalRef = useRef<HTMLDivElement>();
    const [vertical, setVertical] = useState(false);
    const [horizontal, setHorizontal] = useState(false);

    useEffect(() => {
        if (!verticalRef.current) return;

        verticalObserver.current = new IntersectionObserver(([{ isIntersecting, boundingClientRect }]) => {
            setVertical(isIntersecting ? boundingClientRect.y < 0 : boundingClientRect.y > 0);
        });

        verticalObserver.current.observe(verticalRef.current);
        return () => verticalObserver.current.unobserve(verticalRef.current);
    }, [verticalRef.current, vertical]);

    useEffect(() => {
        if (!horizontalRef.current) return;

        horizontalObserver.current = new IntersectionObserver(([{ isIntersecting, boundingClientRect }]) => {
            setHorizontal(!isIntersecting && boundingClientRect.x < 0);
        }, { threshold: [0.99, 1] });

        horizontalObserver.current.observe(horizontalRef.current);
        return () => horizontalObserver.current.unobserve(horizontalRef.current);
    }, [horizontalRef.current, horizontal]);

    return { vertical, horizontal, horizontalRef, verticalRef };
};