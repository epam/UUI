import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';

/**
 * Props of useResizeObserver hook.
 */
export interface UseResizeObserverProps {
    /**
     * The handler for the resizing event, called when the size of any observed elements changes.
     */
    onResize: ResizeObserverCallback;
    /**
     * Elements whose size changes should be tracked.
     */
    observables: Element[];
    /**
     * Delay (in milliseconds) before calling the onResize handler.
     */
    delay?: number;
}

/**
 * Hook that provides the ability to observe size changes of various elements.
 * @returns An observer that tracks size changes of the observed elements.
 */
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
