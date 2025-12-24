import React, { useCallback, useContext, useState } from 'react';
import { PickerModal, FlexRow, FlexCell, Button } from '@epam/uui';
import { UuiContext, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function AsyncTreePickerModalWithEntity() {
    const [value, onValueChange] = useState<Location>({
        childCount: 52,
        id: 'c-AS',
        name: 'Asia',
        parentId: null,
        type: 'continent',
        __typename: 'Location',
        children: [],
    });

    const context = useContext(UuiContext);
    const svc = useUuiContext();

    const dataSource = useAsyncDataSource<Location, string, unknown>(
        {
            api: (options) => svc.api.demo.locations({}, options).then((res: { items: any; }) => res.items),
            getId: ({ id }) => id,
        },
        [],
    );

    const handleModalOpening = useCallback(() => {
        context.uuiModals.show<Location>((props) => {
            return (
                <PickerModal
                    initialValue={ value }
                    dataSource={ dataSource }
                    selectionMode="single"
                    valueType="entity"
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
