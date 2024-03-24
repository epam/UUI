import React, { useState } from 'react';
import { FlexCell, FlexRow, PickerInput } from '@epam/uui';
import { DataQueryFilter, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function LazyTreeSearch() {
    const svc = useUuiContext();
    const [value1, onValueChange1] = useState<string[]>();
    const [value2, onValueChange2] = useState<string[]>();

    const dataSource1 = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            cascadeSelection: true,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );
    
    const dataSource2 = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                if (search && ctx.parentId) { // >1 level, search
                    return Promise.resolve({ items: ctx.parent.children });
                } else if (search) {
                    const tree = svc.api.demo.locationsSearch({ ...request, search });
                    return tree;
                }

                const filter = { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, filter });
            },
            flattenSearchResults: false,
            cascadeSelection: true,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );
    return (
        <FlexCell width={ 612 }>
            <FlexRow columnGap="12">

                <PickerInput
                    dataSource={ dataSource1 }
                    value={ value1 }
                    onValueChange={ onValueChange1 }
                    entityName="location"
                    selectionMode="multi"
                    valueType="id"
                    placeholder="Flatten search results"
                />
                <PickerInput
                    dataSource={ dataSource2 }
                    value={ value2 }
                    onValueChange={ onValueChange2 }
                    entityName="location"
                    selectionMode="multi"
                    valueType="id"
                    placeholder="Tree search results"
                />
            </FlexRow>
        </FlexCell>
    );
}
