import React, { useState } from 'react';
import {FlexRow, PickerInput} from '@epam/promo';
import {DataQueryFilter, useLazyDataSource, useUuiContext} from '@epam/uui';
import { Location } from '@epam/uui-docs';

export default function LazyTreePicker() {
    const svc = useUuiContext();
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
                cascadeSelection={ true }
                entityName='location'
                selectionMode='multi'
                valueType='id'
            />
        </FlexRow>
    );
}
