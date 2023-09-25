import { useCallback, useEffect, useMemo, useState } from 'react';
import { svc } from '../../services';
import { TtsDocsResponse, TType } from './types';

type TAsyncResponse = Promise<{ content: TtsDocsResponse }>;

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

type TUseGetTsDocsForPackageResult = {
    get: (packageName: string, exportName: string) => TType | undefined;
};
export function useTsDocs(): TUseGetTsDocsForPackageResult {
    const [response, setResponse] = useState<TtsDocsResponse>();
    useEffect(() => {
        load().then((res) => {
            setResponse(() => res.content);
        });
    }, []);
    const get = useCallback((packageName: string, exportName: string) => {
        if (response) {
            return response[packageName]?.[exportName];
        }
    }, [response]);
    return useMemo(() => {
        return { get };
    }, [get]);
}
