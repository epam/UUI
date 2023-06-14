import React, { useCallback, useContext, useState } from 'react';
import { PickerModal } from '@epam/uui';
import { FlexRow, FlexCell, Button } from '@epam/promo';
import { UuiContext, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function BasicPickerModal() {
    const [value, onValueChange] = useState([]);
    const context = useContext(UuiContext);
    const svc = useUuiContext();

    const dataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: () => svc.api.demo.locations({}).then((res: { items: any; }) => res.items),
        },
        [],
    );

    console.log('value', value);
    const handleModalOpening = useCallback(() => {
        context.uuiModals.show<string[]>((props) => {
            return (
                <PickerModal
                    initialValue={ value }
                    dataSource={ dataSource }
                    selectionMode="multi"
                    valueType="id"
                    { ...props }
                />
            );
        })
            .then((newSelection) => {
                onValueChange(newSelection);
            })
            .catch(() => {});
    }, [context.uuiModals, dataSource, value]);

    return (
        <FlexCell width={ 612 }>
            <FlexRow spacing="12">
                <Button color="blue" caption="Show locations" onClick={ handleModalOpening } />
            </FlexRow>
        </FlexCell>
    );
}
