import { usePrevious } from '../../../../../../hooks/usePrevious';

export function useDepsChanged(deps: any[]) {
    const prevDeps = usePrevious(deps);
    const isDepsChanged = prevDeps?.length !== deps.length
        || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);

    return isDepsChanged;
}
