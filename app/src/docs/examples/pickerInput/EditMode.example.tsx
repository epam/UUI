import React, { useState, useCallback } from 'react';
import {Text, PickerInput} from '@epam/promo';
import {LazyDataSourceApiRequest, useLazyDataSource} from '@epam/uui';
import { svc } from "../../../services";
import { Person } from '@epam/uui-docs';

export function EditModePickerExample() {
    const [value, onValueChange] = useState<number[]>([]);

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({
        api: loadPersons,
    });

    return (
        <div>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='person'
                selectionMode='multi'
                valueType='id'
                editMode='modal'
            />
        </div>
    );
}
