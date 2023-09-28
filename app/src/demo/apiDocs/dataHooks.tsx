import { useEffect, useState } from 'react';
import { svc } from '../../services';
import { TType, TTypeRefShort } from './docsGenSharedTypes';
import { useUuiContext } from '@epam/uui-core';
import { TApi, TAppContext } from '../../data';

const cache: Map<TTypeRefShort, Promise<{ content: TType }>> = new Map();
function load(ref: TTypeRefShort) {
    const promise = cache.get(ref) || svc.api.getTsDocForType(ref);
    cache.set(ref, promise);
    return promise;
}

export function useTsDocForType(ref: TTypeRefShort): TType {
    const [response, setResponse] = useState<TType>();
    const tsDocRefs = useTsDocsRefs();
    useEffect(() => {
        setResponse(undefined);
        if (tsDocRefs[ref].isPublic) {
            load(ref).then((res) => {
                setResponse(() => res.content);
            });
        }
    }, [ref, tsDocRefs]);
    return response;
}

export function useTsDocsRefs() {
    const { uuiApp } = useUuiContext<TApi, TAppContext>();
    return uuiApp.tsDocs.refs;
}
