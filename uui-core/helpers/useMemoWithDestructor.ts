import { useEffect, useMemo } from 'react';

export function useMemoWithDestructor<T>(factory: () => T, destructor: (value: T) => any, deps: any[]) {
    const value = useMemo(factory, deps);

    useEffect(() => {
        return () => destructor(value);
    }, deps);

    return value;
}