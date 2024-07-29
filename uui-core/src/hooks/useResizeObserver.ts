import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';

/**
 * Props of useResizeObserver hook.
 */
export interface UseResizeObserverProps {
    /**
     * Handler of the resizing event, which is called when the observing target size is changed.
     */
    onResize: ResizeObserverCallback;
    /**
     * Elements, which size change should be tracked.
     */
    observables: Element[];
    /**
     * Delay of onResize handler calling.
     */
    delay?: number;
}

/**
 * Hook, which provides the ability to observe size changes of various elements.
 * @returns observer, which tracks size changes of observing elements.
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
