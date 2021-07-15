import React, { useState, useCallback } from 'react';
import { PickerInput} from '@epam/promo';
import { LazyDataSourceApiRequest, useLazyDataSource } from '@epam/uui';
import { Person, svc } from '@epam/uui-docs';

export default function EditModePickerExample() {
    const [value, onValueChange] = useState<number[]>([]);

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadPersons }, []);

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
