import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, LazyDataSourceApiRequest, LazyDataSourceApiRequestContext, useLazyDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

interface Item {
    id: string;
    name: string;
    parentId: string | null;
    childCount: number;
}

async function api(
    req: LazyDataSourceApiRequest<Item, string, DataQueryFilter<Item>>,
    context: LazyDataSourceApiRequestContext<Item, string>,
) {
    const { parentId } = context;
    if (parentId !== null) {
        const newChildCount = 10;
        return {
            count: newChildCount,
            items: Array(newChildCount)
                .fill(0)
                .map((_, index) => ({
                    parentId,
                    id: `${parentId}.${index}`,
                    name: `Child ${parentId}.${index}`,
                    childCount: newChildCount,
                })),
        };
    }

    const newCount = 30;
    return {
        from: 0,
        count: newCount,
        items: Array(newCount)
            .fill(0)
            .map((_, index) => ({
                parentId: null,
                id: `${index}`,
                name: `Parent ${index}`,
                childCount: 20,
            })),
    };
}
export default function LazyDatasourceRequestingTreeLikeDataExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const datasource1 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api,
        getParentId: ({ parentId }) => parentId,
        getChildCount: () => 0,
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const datasource2 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api,
        getParentId: ({ parentId }) => parentId,
        getChildCount: ({ childCount }) => childCount,
    }, []);

    return (
        <>
            <DatasourceViewer
                exampleTitle="Renders flatten structure, if getChildCount returns 0"
                value={ value1 }
                onValueChange={ onValueChange1 }
                datasource={ datasource1 }
            />
            <DatasourceViewer
                exampleTitle="Renders tree-like structure, if getChildCount returns > 0"
                value={ value2 }
                onValueChange={ onValueChange2 }
                datasource={ datasource2 }
            />
        </>
    );
}
