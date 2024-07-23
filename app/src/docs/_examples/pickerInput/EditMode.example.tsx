import React, { useState, useCallback } from 'react';
import { FlexCell, PickerInput } from '@epam/uui';
import { LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

export default function EditModePickerExample() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>([]);

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadPersons }, []);

    return (
        <FlexCell width={ 300 }>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName="person"
                selectionMode="multi"
                valueType="id"
                editMode="modal"
                maxItems={ 3 }
            />
        </FlexCell>
    );
}
