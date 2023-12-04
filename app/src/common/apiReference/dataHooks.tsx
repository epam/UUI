import { useEffect, useState } from 'react';
import { svc } from '../../services';
import { TType, TTypeRef } from '@epam/uui-docs';
import { TDocsGenTypeSummary } from './types';

const cache: Map<TTypeRef, Promise<{ content: TType }>> = new Map();
export function loadDocsGenType(ref: TTypeRef) {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    const promise = cache.get(ref) || svc.api.getDocsGenType(ref);
    cache.set(ref, promise);
    return promise;
}

export function useDocsGenForType(ref: TTypeRef): TType | undefined {
    const [response, setResponse] = useState<TType>();
    useEffect(() => {
        setResponse(undefined);
        loadDocsGenType(ref).then((res) => {
            setResponse(() => res.content);
        });
    }, [ref]);
    return response;
}

let summariesCache: Promise<{ content: TDocsGenTypeSummary }> = undefined;
function loadSummaries() {
    if (!svc.api) {
        throw new Error('svc.api not available');
    }
    const promise = summariesCache || svc.api.getDocsGenSummaries();
    summariesCache = promise;
    return promise;
}

export function useDocsGenSummaries() {
    const [response, setResponse] = useState<TDocsGenTypeSummary>();
    useEffect(() => {
        setResponse(undefined);
        loadSummaries().then((res) => {
            setResponse(() => res.content);
        });
    }, []);
    return response;
}
