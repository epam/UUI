import React, { useCallback, useContext, useState } from 'react';
import { FlexRow, FlexCell, Button, PickerModal } from '@epam/uui';
import { UuiContext, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function BasicPickerModal() {
    const [value, onValueChange] = useState([]);
    const context = useContext(UuiContext);
    const svc = useUuiContext();

    const dataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: (options) => svc.api.demo.locations({}, options).then((res: { items: any; }) => res.items),
        },
        [],
    );

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
            <FlexRow columnGap="12">
                <Button color="primary" caption="Show locations" onClick={ handleModalOpening } />
            </FlexRow>
        </FlexCell>
    );
}
