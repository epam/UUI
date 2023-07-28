import { useEffect, useRef } from 'react';
import { IView, ListViewProps } from './types';
import { usePrevious } from '../../../hooks';

export function useView<TItem, TId, TFilter, Props extends ListViewProps<TItem, TId, TFilter>>(
    create: () => IView<TItem, TId, TFilter, Props>,
    update: (instance: IView<TItem, TId, TFilter, Props>) => void,
    deps: any[],
): IView<TItem, TId, TFilter, Props> {
    const viewRef = useRef<IView<TItem, TId, TFilter, Props>>(null);
    const prevDeps = usePrevious(deps);

    const isDepsChanged = prevDeps.length !== deps.length || prevDeps.some((devVal, index) => devVal !== deps[index]);

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
