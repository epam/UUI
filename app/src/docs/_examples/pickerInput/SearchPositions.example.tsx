import React, { useCallback, useState } from 'react';
import { FlexRow, PickerInput, FlexCell } from '@epam/uui';
import { LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

export default function SearchPositionsExample() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadPersons }, []);

    return (
        <FlexRow columnGap="12">
            <FlexCell minWidth={ 300 }>
                <PickerInput dataSource={ dataSource } value={ value } onValueChange={ onValueChange } entityName="person" selectionMode="multi" valueType="id" />
            </FlexCell>
            <FlexCell minWidth={ 300 }>
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    entityName="person"
                    selectionMode="multi"
                    maxItems={ 3 }
                    searchPosition="input"
                    valueType="id"
                />
            </FlexCell>
            <FlexCell minWidth={ 295 }>
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    entityName="person"
                    selectionMode="multi"
                    maxItems={ 3 }
                    searchPosition="none"
                    valueType="id"
                />
            </FlexCell>
        </FlexRow>
    );
}
