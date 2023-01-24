import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";

export const useDebounce = <T extends Function>(fn: T, debounceDelay = 50) => {
    const debouncedFn = useMemo(
        () => debounce((...args) => fn(...args), debounceDelay),
        [fn],
    );

    useEffect(() => {
        return () => {
            debouncedFn.cancel();
        };
    }, [debouncedFn]);

    return debouncedFn;
};
