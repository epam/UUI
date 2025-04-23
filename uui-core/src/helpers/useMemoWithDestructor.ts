import { useEffect, useRef } from 'react';

export function useMemoWithDestructor<T>(create: () => T, update: (instance: T) => void, destroy: (value: T) => any, deps: any[]) {
    const ref = useRef<T>(undefined);
    const prevDeps = useRef(deps);

    const isDepsChanged = prevDeps.current.length !== deps.length || prevDeps.current.some((devVal, index) => devVal !== deps[index]);

    if (ref.current == null || isDepsChanged) {
        prevDeps.current = deps;
        ref.current = create();
    }

    update(ref.current);

    const current = ref.current;

    useEffect(() => {
        // Value here is memoized in closure at the time of its creation.
        // So we are not destroying the value we just created above.
        return () => current && destroy(current);
    }, deps);

    return ref.current;
}
