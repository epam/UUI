import { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';

export function usePrevious<T>(value: T) {
    const previousValueRef = useRef(value);

    useEffect(() => {
        if (!isEqual(previousValueRef.current, value)) {
            previousValueRef.current = value;
        }
    }, [value]);

    return previousValueRef.current;
}
