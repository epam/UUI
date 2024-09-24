import React, { useState } from 'react';
import { Location } from '@epam/uui-docs';
import { useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, PickerInput } from '@epam/uui';
import { TApi } from '../../../data';

export default function AsyncPickerInputExample() {
    const svc = useUuiContext<TApi>();
    const [locations, setLocations] = useState<string[]>([]);

    const locationsDataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: () => svc.api.demo.locations({}).then((res) => res.items),
        },
        [],
    );

    return (
        <FlexCell width={ 300 }>
            <PickerInput<Location, string>
                dataSource={ locationsDataSource }
                value={ locations }
                onValueChange={ setLocations }
                entityName="location"
                selectionMode="multi"
                valueType="id"
                maxItems={ 3 }
            />
        </FlexCell>
    );
}
