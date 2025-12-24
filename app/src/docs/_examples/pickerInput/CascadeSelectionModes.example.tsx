import React, { useState } from 'react';
import { FlexRow, MultiSwitch, FlexCell, PickerInput } from '@epam/uui';
import { DataQueryFilter, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

const cascadeSelectionModes: Array<{ id: 'explicit' | 'implicit'; caption: string }> = [
    {
        id: 'explicit',
        caption: 'Explicit cascade selection',
    }, {
        id: 'implicit',
        caption: 'Implicit cascade selection',
    },
];

export default function CascadeSelectionModesExample() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>();
    const [cascadeSelection, setCascadeSelection] = useState(cascadeSelectionModes[0].id);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                // and since parentId is meaningful value, it is required to exclude it from the filter.
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter }, ctx);
            },
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );

    return (
        <FlexCell width={ 350 }>
            <FlexRow vPadding="12">
                <MultiSwitch size="24" value={ cascadeSelection } onValueChange={ setCascadeSelection } items={ cascadeSelectionModes } />
            </FlexRow>

            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName="location"
                selectionMode="multi"
                valueType="id"
                maxItems={ 3 }
                cascadeSelection={ cascadeSelection }
            />
        </FlexCell>
    );
}
