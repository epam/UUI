import React, { useState } from "react";
import { Location } from "@epam/uui-docs";
import { AsyncDataSource, useUuiContext } from "@epam/uui";
import { PickerInput } from "@epam/promo";

export default function AsyncPickerInputExample() {
    const svc = useUuiContext();
    const [locations, setLocations] = useState<string[]>(null);

    const locationsDataSource = new AsyncDataSource({
        api: () => svc.api.demo.locations({}).then((res: any) => res.items),
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