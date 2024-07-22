import React, { useCallback, useState } from 'react';
import { Person } from '@epam/uui-docs';
import { DataRowProps, DataSourceState, LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { PickerInput, DataPickerRow, PickerItem, FlexCell } from '@epam/uui';

export default function LazyPersonsMultiPickerWithCustomUserRow() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource(
        {
            api: loadPersons,
        },
        [],
    );

    const renderUserRow = (props: DataRowProps<Person, number>, dsState: DataSourceState) => (
        <DataPickerRow
            { ...props }
            key={ props.rowKey }
            alignActions="center"
            padding="12"
            renderItem={ (item) => <PickerItem { ...props } dataSourceState={ dsState } title={ item.name } subtitle={ item.jobTitle } avatarUrl={ item.avatarUrl } /> }
        />
    );

    return (
        <FlexCell width={ 300 }>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                renderRow={ renderUserRow }
                entityName="person"
                selectionMode="multi"
                valueType="id"
                maxItems={ 3 }
            />
        </FlexCell>
    );
}
