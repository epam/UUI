import { useEffect, useMemo } from 'react';

export function useMemoWithDestructor<T>(create: () => T, update: (instance: T) => void, destroy: (value: T) => any, deps: any[]) {
    const value = useMemo(create, deps);

    update(value);

    useEffect(() => {
        // Value here is memoized in closure at the time of its creation.
        // So we are not destroying the value we just created in useMemo above.
        return () => destroy(value);
    }, deps);

    return value;
}