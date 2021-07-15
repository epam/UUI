import React, { useMemo, useState } from "react";
import { Country, svc } from "@epam/uui-docs";
import { AsyncDataSource } from "@epam/uui";
import { PickerList } from "@epam/loveship";

export default function BasicPickerListExample() {
    const [countries, setCountries] = useState<string[]>(null);

    const locationsDataSource = useMemo(() => new AsyncDataSource({
        api: () => svc.api.demo.countries({}).then(res => res.items),
    }), []);

    return (
        <PickerList<Country, string>
            dataSource={ locationsDataSource }
            value={ countries }
            onValueChange={ setCountries }
            entityName='location'
            selectionMode='multi'
            valueType='id'
            maxDefaultItems={ 5 }
            maxTotalItems={ 10 }
            sorting={ { field: 'name', direction: 'asc' } }
        />
    );
}