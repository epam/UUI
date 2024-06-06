import { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';

/**
 * Hook configuration, which defines if previous value will be deeply compared with new value to be saved or not.
 */
export interface UsePreviousConfig {
    /**
     * If compare is set to true, previous value will be deeply compared with the new value,
     * and previous value will be updated only if value is changed (not the link to the object).
     * Otherwise, previous value will be returned.
     * If compare is false, previous value will be changed on every rerender.
     */
    compare?: boolean;
}

/**
 * Hook, which returns previous version of the value, passed to the arguments.
 * @param value
 * @param config - Hook configuration, which defines if previous value will be deeply compared with new value to be saved or not.
 * @param config.compare - If compare is set to true, previous value will be deeply compared with the new value,
 * and previous value will be updated only if value is changed (not the link to the object). Otherwise, previous value will be returned.
 * If compare is false, previous value will be changed on every rerender.
 * @returns previous version of the value, passed to the props.
 */
export function usePrevious<T>(value: T, { compare }: UsePreviousConfig = {}): T | null {
    const previousValueRef = useRef<T>(null);

    useEffect(() => {
        if (compare) {
            if (!isEqual(previousValueRef.current, value)) {
                previousValueRef.current = value;
            }
        } else {
            previousValueRef.current = value;
        }
    }, [value]);

    return previousValueRef.current;
}
