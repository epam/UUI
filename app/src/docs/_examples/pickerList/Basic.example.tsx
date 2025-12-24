import React, { useState } from 'react';
import { Country } from '@epam/uui-docs';
import { useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { PickerList } from '@epam/uui';

export default function BasicPickerListExample() {
    const svc = useUuiContext();
    const [countries, setCountries] = useState<string[]>(['GM', 'UA']);
    const locationsDataSource = useAsyncDataSource<Country, string, unknown>(
        {
            api: (options) => svc.api.demo.countries({}, options).then((res: any) => res.items),
        },
        [],
    );

    return (
        <PickerList
            dataSource={ locationsDataSource }
            value={ countries }
            onValueChange={ setCountries }
            entityName="location"
            selectionMode="multi"
            valueType="id"
            maxDefaultItems={ 5 }
            maxTotalItems={ 10 }
            sorting={ { field: 'name', direction: 'asc' } }
        />
    );
}
