import React, { useState, useCallback } from 'react';
import { FlexCell, PickerInput } from '@epam/uui';
import { LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

export default function LazyPersonsMultiPicker() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadPersons, selectAll: false }, []);

    return (
        <FlexCell width={ 300 }>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName="person"
                selectionMode="multi"
                valueType="id"
                maxItems={ 3 }
            />
        </FlexCell>
    );
}
