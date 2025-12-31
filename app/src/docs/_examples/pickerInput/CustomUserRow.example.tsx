import React, { useCallback, useState } from 'react';
import { Person } from '@epam/uui-docs';
import { PickerRenderRowParams, DataSourceState, LazyDataSourceApiRequest, useLazyDataSource, useUuiContext, LazyDataSourceApiRequestContext } from '@epam/uui-core';
import { PickerInput, DataPickerRow, PickerItem, FlexCell } from '@epam/uui';

export default function LazyPersonsMultiPickerWithCustomUserRow() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>, ctx: LazyDataSourceApiRequestContext<Person, number>) => {
        return svc.api.demo.persons(request, ctx);
    }, []);

    const dataSource = useLazyDataSource(
        {
            api: loadPersons,
        },
        [],
    );

    const renderUserRow = (props: PickerRenderRowParams<Person, number>, dsState: DataSourceState) => (
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
