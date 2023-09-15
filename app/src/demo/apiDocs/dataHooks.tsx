import { useEffect, useState } from 'react';
import { svc } from '../../services';
import { TPropsV2Response } from './types';

type TAsyncResponse = Promise<{ content: TPropsV2Response }>;

const load = (() => {
    // simple in-memory cache to avoid duplicated requests.
    const cache = new Map<string, TAsyncResponse>();
    return (packageName: string): TAsyncResponse => {
        const cached = cache.get(packageName) || svc.api.getTsDocs(packageName);
        cache.set(packageName, cached);
        return cached;
    };
})();

export function useGetTsDocsForPackage(packageName?: string): TPropsV2Response {
    const [response, setResponse] = useState<TPropsV2Response>();
    useEffect(() => {
        if (packageName) {
            load(packageName).then((res) => {
                setResponse(() => res.content);
            });
        } else {
            setResponse(undefined);
        }
    }, [packageName]);
    return response;
}
