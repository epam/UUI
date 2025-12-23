import React, { useState, useCallback } from 'react';
import { Text, PickerInput, FlexCell } from '@epam/uui';
import { LazyDataSourceApiRequest, LazyDataSourceApiRequestContext, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

export default function ValueTypeExamplePicker() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<Person[]>([]);

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>, ctx: LazyDataSourceApiRequestContext<Person, number>) => {
        return svc.api.demo.persons(request, ctx);
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
                emptyValue={ [] }
                valueType="entity"
                maxItems={ 3 }
            />
            <Text>
                Selected users:
                {value.map((i) => i.name).join(', ')}
            </Text>
        </FlexCell>
    );
}
