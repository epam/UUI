import React, { useState, useCallback } from 'react';
import {FlexRow, PickerInput} from '@epam/promo';
import {DataQueryFilter, LazyDataSourceApiRequest, useLazyDataSource} from '@epam/uui';
import { svc } from "../../../services";
import { Location } from '@epam/uui-docs';

export function LazyTreePicker() {
    const [value, onValueChange] = useState<string[]>();

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>({
        api: async (request, ctx) => {
            let { filter, search, range } = request;

            // turn tree into flat list on search
            let flatten = !!search;

            if (!flatten) {
                filter = { ...filter, parentId: (ctx.parentId || { isNull: true }) };
            }

            const result = await svc.api.demo.locations({ filter, search, range });

            if (flatten) {
                result.items.forEach(i => i.childCount = 0);
            }

            return result;
        },
        getChildCount: l => l.childCount,
    }, []);

    return (
        <FlexRow>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='location'
                selectionMode='multi'
                valueType='id'
            />
        </FlexRow>
    );
}
