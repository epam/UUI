import React, { useState, useCallback } from 'react';
import {FlexRow, PickerInput} from '@epam/promo';
import {DataQueryFilter, LazyDataSourceApiRequest, useLazyDataSource} from '@epam/uui';
import { svc } from "../../../services";
import { Location } from '@epam/uui-docs';

export function LazyTreePicker() {
    const [value, onValueChange] = useState<string[]>();

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>({
        api: (request, ctx) => svc.api.demo.locations({ ...request, filter: { parentId: ctx.parentId} }),
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
