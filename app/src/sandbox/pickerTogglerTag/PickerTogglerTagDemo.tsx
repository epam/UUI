import React, { useState } from 'react';
import { DataQueryFilter, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, FlexRow, LabeledInput, NumericInput, PickerInput } from '@epam/uui';
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

export function PickerTogglerTagDemo() {
    const svc = useUuiContext();
    const [maxItems, setMaxItems] = useState(null);
    const [value, onValueChange] = useState<string[]>();
    const [cascadeSelection] = useState(cascadeSelectionModes[0].id);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                // and since parentId is meaningful value, it is required to exclude it from the filter.
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
        <FlexCell width={ 370 }>
            <FlexRow margin="12">
                <LabeledInput label="Set maxItem">
                    <NumericInput value={ maxItems } onValueChange={ setMaxItems } />
                </LabeledInput>
            </FlexRow>
            <FlexRow margin="12">
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    entityName="location"
                    selectionMode="multi"
                    valueType="id"
                    cascadeSelection={ cascadeSelection }
                    maxItems={ maxItems }
                />
            </FlexRow>
        </FlexCell>
    );
}
