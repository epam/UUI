import React, { useState, useCallback } from 'react';
import { FlexRow, PickerInput } from '@epam/promo';
import { LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui';
import { Person } from '@epam/uui-docs';

export default function LazyPersonsMultiPicker() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadPersons }, []);

    return (
        <FlexRow>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='person'
                selectionMode='multi'
                valueType='id'

            />
        </FlexRow>
    );
}
