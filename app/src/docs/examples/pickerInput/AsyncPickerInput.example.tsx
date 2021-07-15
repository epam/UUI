import React, { useState } from "react";
import { Location, svc } from "@epam/uui-docs";
import { AsyncDataSource } from "@epam/uui";
import { PickerInput } from "@epam/promo";

export default function AsyncPickerInputExample() {
    const [locations, setLocations] = useState<string[]>(null);

    const locationsDataSource = new AsyncDataSource({
        api: () => svc.api.demo.locations({}).then(res => res.items),
    });

    return (
        <div>
            <PickerInput<Location, string>
                dataSource={ locationsDataSource }
                value={ locations }
                onValueChange={ setLocations }
                entityName='location'
                selectionMode='multi'
                valueType='id'
            />
        </div>
    );
};