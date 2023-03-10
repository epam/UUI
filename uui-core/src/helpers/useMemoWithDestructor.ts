import { useEffect, useRef } from 'react';
import { useForceUpdate } from '../hooks';

export function useMemoWithDestructor<T>(create: () => T, update: (instance: T) => void, destroy: (value: T) => any, deps: any[]) {
    const ref = useRef<T>();
    const prevDeps = useRef(deps);
    const forceUpdate = useForceUpdate();
    const createView = () => {
        const isDepsChanged = (prevDeps.current.length != deps.length)
            || prevDeps.current.some((devVal, index) => devVal != deps[index]);

        if (ref.current == null || isDepsChanged) {
            prevDeps.current = deps;
            return create();
        }
        return ref.current;
    };

    ref.current = createView();
    update(ref.current);

    const current = ref.current;

    useEffect(() => {
        if (ref.current === null) {
            ref.current = createView();
            forceUpdate();
        }

        // Value here is memoized in closure at the time of its creation.
        // So we are not destroying the value we just created above.
        return () => {
            current && destroy(current);
            ref.current = null;
        };
    }, deps);

    return ref.current;
}
