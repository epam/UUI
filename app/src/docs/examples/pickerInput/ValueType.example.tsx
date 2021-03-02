import React, { useState, useCallback } from 'react';
import {Text, PickerInput} from '@epam/promo';
import {LazyDataSourceApiRequest, useLazyDataSource} from '@epam/uui';
import { svc } from "../../../services";
import { Person } from '@epam/uui-docs';

export function ValueTypeExamplePicker() {
    const [value, onValueChange] = useState<Person[]>([]);

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
                emptyValue={ [] }
                valueType='entity'
            />
            <Text>
                Selected users: { value.map(i => i.name).join(', ') }
            </Text>
        </div>
    );
}
