import { MutableRefObject, useRef, useState, useEffect } from "react";

interface UseTableShadowsApi {
    vertical?: boolean;
    horizontal?: boolean;
    intersectionRef: MutableRefObject<HTMLDivElement>;
};

export function useTableShadows(type: 'vertical' | 'horizontal' = 'vertical'): UseTableShadowsApi {
    const observer = useRef<IntersectionObserver>();
    const intersectionRef = useRef<HTMLDivElement>();
    const [tableShadows, setTableShadows] = useState<Omit<UseTableShadowsApi, 'intersectionRef'>>({ [type]: false });

    useEffect(() => {
        if (!intersectionRef.current) return;

        observer.current = new IntersectionObserver(([{ isIntersecting }]) => {
            if (!isIntersecting && !tableShadows[type]) {
                setTableShadows({ ...tableShadows, [type]: true });
            } else if (isIntersecting && tableShadows[type]) {
                setTableShadows({ ...tableShadows, [type]: false });
            }
        });

        observer.current.observe(intersectionRef.current);
        return () => observer.current.unobserve(intersectionRef.current);
    }, [intersectionRef.current, tableShadows]);

    return { ...tableShadows, intersectionRef };
};