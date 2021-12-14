import React, { useState } from "react";
import { Location } from "@epam/uui-docs";
import { useAsyncDataSource, useUuiContext } from "@epam/uui";
import { PickerInput } from "@epam/promo";
import { TApi } from "../../../data";

export default function AsyncPickerInputExample() {
    const svc = useUuiContext<TApi>();
    const [locations, setLocations] = useState<string[]>(null);

    const locationsDataSource = useAsyncDataSource<Location, string, unknown>({
        api: () => svc.api.demo.locations({}).then((res) => res.items),
    }, []);

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