import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';

export interface UseResizeObserverProps {
    onResize: ResizeObserverCallback;
    observables: Element[];
    delay?: number;
}

export function useResizeObserver(props: UseResizeObserverProps) {
    const onResize = useMemo(() => {
        if (props.delay === undefined) {
            return props.onResize;
        }
        return debounce(props.onResize, props.delay, { leading: false, trailing: true });
    }, [props.delay, props.onResize]);

    const resizeObserver = useMemo(() => new ResizeObserver(onResize), [onResize]);

    const observables = props.observables.filter(Boolean);
    useEffect(() => {
        observables.forEach((observable) => resizeObserver.observe(observable));

        return () => {
            resizeObserver.disconnect();
        };
    }, [observables.length]);

    return resizeObserver;
}
