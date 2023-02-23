import { useEffect, useRef } from "react";
import { ListView } from "./types";

export function useView<TItem, TId, TFilter>(
    create: () => ListView<TItem, TId, TFilter>,
    update: (instance: ListView<TItem, TId, TFilter>) => void,
    deps: any[],
) {
    const viewRef = useRef<ListView<TItem, TId, TFilter>>(null);
    const prevDeps = useRef(deps);

    const isDepsChanged = (prevDeps.current.length != deps.length)
        || prevDeps.current.some((devVal, index) => devVal != deps[index]);

    if (viewRef.current === null || isDepsChanged) {
        viewRef.current = create();
    }

    const current = viewRef.current;

    update(current);

    useEffect(() => {
        // Value here is memoized in closure at the time of its creation.
        // So we are not destroying the value we just created above.
        return () => current && current.destroy();
    }, deps);

    return viewRef.current;
}
