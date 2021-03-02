import React, {useCallback, useState} from 'react';
import {FlexRow, PickerInput} from '@epam/promo';
import {LazyDataSourceApiRequest, useLazyDataSource} from '@epam/uui';
import { svc } from "../../../services";
import { Person } from '@epam/uui-docs';

export function SearchPositionsExample() {
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({
        api: loadPersons,
    });

    return (
        <FlexRow spacing='12' >
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='person'
                selectionMode='multi'
                valueType='id'
            />
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='person'
                selectionMode='multi'
                searchPosition='input'
                valueType='id'
            />
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName='person'
                selectionMode='multi'
                searchPosition='none'
                valueType='id'
            />
        </FlexRow>
    );
}
