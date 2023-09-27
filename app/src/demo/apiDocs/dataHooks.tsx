import { useCallback, useEffect, useMemo, useState } from 'react';
import { svc } from '../../services';
import { TResultJson, TType, TTypeRef, TTypeRefShort } from './docsGenSharedTypes';

type TAsyncResponse = Promise<{ content: TResultJson }>;

const load = (() => {
    // simple in-memory cache to avoid duplicated requests.
    let cachedPromise: TAsyncResponse = undefined;
    return (): TAsyncResponse => {
        // @ts-ignore
        const cached = cachedPromise || svc.api.getTsDocs();
        cachedPromise = cached;
        return cached;
    };
})();

export type TUseGetTsDocsForPackageResult = {
    get: (typeRefShort: TTypeRefShort) => TType | undefined;
    getTypeRef: (typeRefShort: TTypeRefShort) => TTypeRef | undefined;
} | undefined;
export function useTsDocs(): TUseGetTsDocsForPackageResult {
    const [response, setResponse] = useState<TResultJson>();
    useEffect(() => {
        load().then((res) => {
            setResponse(() => res.content);
        });
    }, []);
    const get = useCallback((typeRefShort: TTypeRefShort) => {
        if (response) {
            const [moduleName, exportName] = typeRefShort.split(':');
            return response.byModule[moduleName]?.[exportName];
        }
    }, [response]);
    const getTypeRef = useCallback((typeRefShort: TTypeRefShort) => {
        if (response) {
            return response.references[typeRefShort];
        }
    }, [response]);
    return useMemo(() => {
        if (response) {
            return { get, getTypeRef };
        }
    }, [get, getTypeRef, response]);
}
