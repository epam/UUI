/* eslint-disable no-console */
import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, LazyDataSourceApiRequest, LazyDataSourceApiRequestContext, useLazyDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

interface Item {
    id: string;
    name: string;
    parentId: string | null;
    childCount: number;
}

function api(tag: string) {
    return async (
        request: LazyDataSourceApiRequest<Item, string, DataQueryFilter<Item>>,
        context: LazyDataSourceApiRequestContext<Item, string>,
    ) => {
        if (request.ids && request.ids.length) {
            const items = request.ids.map((id) => {
                const ids = id.split('.').slice(0, -1);
                return {
                    parentId: ids.join('.'),
                    id,
                    name: `Child ${id}`,
                    childCount: 5,
                };
            });

            const response = { items };

            console.log(`request #${tag}:`, request);
            console.log(`context #${tag}:`, context);
            console.log(`response #${tag}:`, response);

            return response;
        }
        const { parentId } = context;
        if (parentId !== null) {
            const response = {
                count: 5,
                items: Array(5)
                    .fill(0)
                    .map((_, index) => ({
                        parentId,
                        id: `${parentId}.${index}`,
                        name: `Child ${parentId}.${index}`,
                        childCount: 5,
                    })),
            };
            
            console.log(`request #${tag}:`, request);
            console.log(`context #${tag}:`, context);
            console.log(`response #${tag}:`, response);
            return response;
        }

        const response = {
            from: 0,
            count: request.range.count,
            items: Array(request.range.count)
                .fill(0)
                .map((_, index) => ({
                    parentId: null,
                    id: `${index}`,
                    name: `Parent ${index}`,
                    childCount: 20,
                })),
        };
                    
        console.log(`request #${tag}:`, request);
        console.log(`context #${tag}:`, context);
        console.log(`response #${tag}:`, response);
        return response;
    };
}

export default function LazyDataSourceRequestingTreeLikeDataExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: api('Without children'),
        getParentId: ({ parentId }) => parentId,
        getChildCount: () => 0,
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: api('With children'),
        getParentId: ({ parentId }) => parentId,
        getChildCount: ({ childCount }) => childCount,
    }, []);

    const [value3, onValueChange3] = useState<DataSourceState>({
        checked: ['1.1.1', '2.3.5'],
    });
    const dataSource3 = useLazyDataSource<Item, string, DataQueryFilter<Item>>({
        api: api('With pre-selected children'),
        getParentId: ({ parentId }) => parentId,
        getChildCount: ({ childCount }) => childCount,
        rowOptions: {
            checkbox: { isVisible: true },
        },
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="Renders flatten structure, if getChildCount returns 0"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            <DataSourceViewer
                exampleTitle="Renders tree-like structure, if getChildCount returns > 0"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
            <DataSourceViewer
                exampleTitle="Preselected items"
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
            />
        </>
    );
}
