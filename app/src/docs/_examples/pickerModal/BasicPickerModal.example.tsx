import React, { useCallback, useContext, useState, useEffect } from 'react';
import { PickerModal } from '@epam/uui';
import { FlexRow, FlexCell, Button } from '@epam/promo';
import { UuiContext, useAsyncDataSource } from '@epam/uui-core';
import { svc } from '../../../services';
import { Location } from '@epam/uui-docs';

export default function LanguagesPickerModal() {
    const [value, onValueChange] = useState([]);
    const context = useContext(UuiContext);

    const dataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: () => svc.api.demo.locations({}).then((res) => res.items),
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
            <FlexRow spacing="12">
                <Button color="blue" caption="Show locations" onClick={ handleModalOpening } />
            </FlexRow>
        </FlexCell>
    );
}
