import React, { useCallback, useMemo, useState } from 'react';
import { FlexCell, PickerInput } from '@epam/uui';
import { DataQueryFilter, UuiContexts, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';
import { TApi } from '../../../data';

export default function LazyTreePicker() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [selectedId, onValueChange] = useState<string>('2509031');

    const itemsMap = useMemo(() => new Map(), []);

    const isFoldedByDefault = useCallback((item: Location) => {
        return !['c-AF', 'DZ'].includes(item.id);
    }, []);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: async (request, ctx) => {
                const { search } = request;
                const filter = search ? {} : { parentId: ctx?.parentId };
                const result = await svc.api.demo.locations({ ...request, search, filter });
                result.items.forEach((item) => itemsMap.set(item.id, item));
                return result;
            },
            cascadeSelection: true,
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
                value={ selectedId }
                onValueChange={ onValueChange }
                entityName="location"
                selectionMode="single"
                valueType="id"
                cascadeSelection="explicit"
                isFoldedByDefault={ isFoldedByDefault }
            />
        </FlexCell>
    );
}
