import React, { useCallback, useContext, useState } from 'react';
import { DataPickerRow, PickerItem, PickerModal, FlexRow, FlexCell, Button } from '@epam/uui';
import { DataQueryFilter, DataRowProps, UuiContext, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function LazyTreePickerModal() {
    const [value, onValueChange] = useState<string[]>(['2395635', 'AO']);
    const svc = useUuiContext();
    const context = useContext(UuiContext);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                // if search is specified, it is required to search over all the children,
                // and since parentId is meaningful value, it is required to exclude it from the filter.
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            cascadeSelection: true,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
            flattenSearchResults: false,
        },
        [],
    );

    const renderRow = (rowProps: DataRowProps<Location, string>) => (
        <DataPickerRow
            { ...rowProps }
            key={ rowProps.rowKey }
            borderBottom="none"
            size="36"
            padding="24"
            renderItem={ (item: Location, pickerItemProps: DataRowProps<Location, string>) => (
                <PickerItem title={ item.name } size="36" { ...pickerItemProps } />
            ) }
        />
    );

    const handleModalOpening = useCallback(() => {
        context.uuiModals
            .show((props) => (
                <PickerModal
                    initialValue={ value }
                    dataSource={ dataSource }
                    selectionMode="multi"
                    valueType="id"
                    renderRow={ renderRow }
                    { ...props }
                />
            ))
            .then((newSelection) => {
                onValueChange(newSelection as string[]);
            })
            .catch(() => {});
    }, [context.uuiModals, dataSource, value]);

    return (
        <FlexCell width={ 612 }>
            <FlexRow spacing="12">
                <Button color="primary" caption="Show locations" onClick={ handleModalOpening } />
            </FlexRow>
        </FlexCell>
    );
}
