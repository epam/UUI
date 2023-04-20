import {
    useState, createContext, useContext, useMemo, useEffect,
} from 'react';
import { DbRef } from './DbRef';
import { DbViewOptions } from '.';

export const DbContext = createContext(null);

export function useDbRef<TDbRef extends DbRef<any, any>>() {
    return useContext(DbContext) as TDbRef;
}

export function useDbView<TDb, TResult, TParams = void, TDependencies = void>(
    fn: (db: TDb, params: TParams, dependencies: TDependencies) => TResult,
    params?: TParams,
    options?: DbViewOptions<TDb, TResult, TParams, TDependencies>,
): TResult {
    const dbRef = useDbRef();
    const [state, setState] = useState<TResult>();
    const subscription = useMemo(() => dbRef.subscribe<TResult, TParams, TDependencies>({ compute: fn, ...options }, params, setState), []);
    subscription.update(params);

    useEffect(() => {
        return () => subscription.unsubscribe();
    }, []);

    return subscription.currentValue;
}
