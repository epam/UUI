import { useEffect, useRef } from "react";
import { IView, ListViewProps } from "./types";

export function useView<TItem, TId, TFilter, TSubtotals, Props extends ListViewProps<TItem, TId, TFilter, TSubtotals>>(
    create: () => IView<TItem, TId, TFilter, TSubtotals, Props>,
    update: (instance: IView<TItem, TId, TFilter, TSubtotals, Props>) => void,
    deps: any[],
): IView<TItem, TId, TFilter, TSubtotals, Props> {
    const viewRef = useRef<IView<TItem, TId, TFilter, TSubtotals, Props>>(null);
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
