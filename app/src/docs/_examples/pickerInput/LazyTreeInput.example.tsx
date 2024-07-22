import React, { useState } from 'react';
import { FlexCell, PickerInput } from '@epam/uui';
import { DataQueryFilter, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function LazyTreePicker() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>([]);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );

    return (
        <FlexCell width={ 300 }>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName="location"
                selectionMode="multi"
                valueType="id"
                cascadeSelection="implicit"
                maxItems={ 3 }
            />
        </FlexCell>
    );
}
