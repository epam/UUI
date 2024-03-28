import { useSimplePrevious } from '../../../../../../hooks';

export function useDepsChanged(deps: any[]) {
    const prevDeps = useSimplePrevious(deps);
    const isDepsChanged = prevDeps?.length !== deps.length
        || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);

    return isDepsChanged;
}
