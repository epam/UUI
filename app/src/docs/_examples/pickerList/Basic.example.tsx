import React, { useState } from "react";
import { Country } from "@epam/uui-docs";
import { useAsyncDataSource, useUuiContext } from "@epam/uui-core";
import { PickerList } from "@epam/loveship";

export default function BasicPickerListExample() {
    const svc = useUuiContext();
    const [countries, setCountries] = useState<string[]>(null);

    const locationsDataSource = useAsyncDataSource<Country, string, unknown>({
        api: () => svc.api.demo.countries({}).then((res: any) => res.items),
    }, []);

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