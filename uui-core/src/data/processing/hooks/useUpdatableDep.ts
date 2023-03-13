import { useCallback, useMemo, useState } from "react";

export const useUpdatableDep = (): [boolean, () => void] => {
    const [dep, setDep] = useState<boolean>(false);

    const update = useCallback(() => {
        setDep(!dep);
    }, [dep]);

    return useMemo(() => [dep, update], [dep]);
};
