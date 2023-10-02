import { useEffect, useState } from 'react';
import { svc } from '../../services';
import { TType, TTypeRef } from './sharedTypes';
import { useUuiContext } from '@epam/uui-core';
import { TApi, TAppContext } from '../../data';

const cache: Map<TTypeRef, Promise<{ content: TType }>> = new Map();
function load(ref: TTypeRef) {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    const promise = cache.get(ref) || svc.api.getDocsGenType(ref);
    cache.set(ref, promise);
    return promise;
}

export function useDocsGenForType(ref: TTypeRef): TType | undefined {
    const [response, setResponse] = useState<TType>();
    const docsGenSum = useDocsGenSummaries();
    useEffect(() => {
        setResponse(undefined);
        if (docsGenSum[ref].exported) {
            load(ref).then((res) => {
                setResponse(() => res.content);
            });
        }
    }, [ref, docsGenSum]);
    return response;
}

export function useDocsGenSummaries() {
    const { uuiApp } = useUuiContext<TApi, TAppContext>();
    return uuiApp.docsGen.summaries;
}
