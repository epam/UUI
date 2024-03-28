import { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';

export function usePrevious<T>(value: T): T | null {
    const previousValueRef = useRef<T>(null);

    useEffect(() => {
        if (!isEqual(previousValueRef.current, value)) {
            previousValueRef.current = value;
        }
    }, [value]);

    return previousValueRef.current;
}

export function useSimplePrevious<T>(value: T): T | null {
    const previousValueRef = useRef<T>(null);

    useEffect(() => {
        previousValueRef.current = value;
    }, [value]);

    return previousValueRef.current;
}
