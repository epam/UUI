import { useEffect, useMemo, useState } from 'react';
import { svc } from '../../services';
import { TPropsV2Response } from './types';
import { useArrayDataSource } from '@epam/uui-core';
import { INCLUDED_UUI_PACKAGES } from './constants';

export function useGetTsDocsForPackage(packageName?: string): TPropsV2Response {
    const [response, setResponse] = useState<TPropsV2Response>();
    useEffect(() => {
        if (packageName) {
            const promise = svc.api.getTsDocs(packageName) as Promise<{ content: TPropsV2Response }>;
            promise.then((res) => {
                setResponse(() => res.content);
            });
        } else {
            setResponse(undefined);
        }
    }, [packageName]);
    return response;
}

export type TExportsDsItem = {
    id: string; name: string; parentId: string
};
export type TModulesDsItem = {
    id: string; name: string;
};
export function usePropsDataSources(params: { packageName?: string, exportName?: string }) {
    const { packageName } = params;
    const modulesDs = useArrayDataSource<TModulesDsItem, TModulesDsItem['id'], unknown>(
        { items: INCLUDED_UUI_PACKAGES.map((name) => ({ name, id: name })) },
        [],
    );
    const response = useGetTsDocsForPackage(packageName);
    //
    const exportsDsItems: TExportsDsItem[] = useMemo(() => {
        if (response) {
            const allParents = new Set<string>();
            const mExports = Object.keys(response).reduce<TExportsDsItem[]>((acc, exportKey) => {
                const { kind, name } = response[exportKey];
                allParents.add(kind);
                acc.push({ id: name, name, parentId: kind });
                return acc;
            }, []);
            const groups = [...allParents].map((parentId) => ({ id: parentId, name: parentId, parentId: null }));
            return groups.concat(mExports);
        }
        return [];
    }, [response]);
    const exportsDs = useArrayDataSource<TExportsDsItem, TExportsDsItem['id'], unknown>(
        {
            items: exportsDsItems,
            getParentId: (i) => i.parentId,
        },
        [exportsDsItems],
    );

    return {
        modulesDs,
        exportsDs,
    };
}
