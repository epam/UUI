import React, { useState } from 'react';
import { Location } from '@epam/uui-docs';
import { useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, FlexRow, PickerInput } from '@epam/promo';
import { TApi } from '../../../data';

export default function GetRowOptionsExample() {
    const svc = useUuiContext<TApi>();
    const [location, setLocation] = useState<string>();

    const locationsDataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: () => svc.api.demo.locations({}).then(({ items }) => items),
            getId: (item) => item.id,
        },
        [],
    );

    return (
        <FlexCell width={ 612 }>
            <FlexRow spacing="12">
                <PickerInput<Location, string>
                    dataSource={ locationsDataSource }
                    value={ location }
                    onValueChange={ setLocation }
                    getRowOptions={ (item) => ({
                        isDisabled: !item?.parentId,
                        isSelectable: !!item?.parentId,
                    }) }
                    getName={ (item) => item.name }
                    entityName="Location"
                    selectionMode="single"
                    valueType="id"
                />
            </FlexRow>
        </FlexCell>
    );
}
