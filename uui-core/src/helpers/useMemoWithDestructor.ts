import { useEffect, useRef } from 'react';
import { useForceUpdate } from '../hooks';

export function useMemoWithDestructor<T>(create: () => T, update: (instance: T) => void, destroy: (value: T) => any, deps: any[]) {
    const ref = useRef<T>();
    const preDestroy = useRef<boolean>(true);
    const prevDeps = useRef(deps);

    const isDepsChanged = (prevDeps.current.length != deps.length)
        || prevDeps.current.some((devVal, index) => devVal != deps[index]);

    if (ref.current == null || isDepsChanged) {
        prevDeps.current = deps;
        ref.current = create();
    }

    update(ref.current);

    const current = ref.current;

    useEffect(() => {
        // Value here is memoized in closure at the time of its creation.
        // So we are not destroying the value we just created above.
        return () => {
            // first destroy is new react's flow destroy.
            if (preDestroy.current) {
                preDestroy.current = false;
            } else {
                current && destroy(current);
                ref.current = null;
            }
        };
    }, deps);

    return ref.current;
}
