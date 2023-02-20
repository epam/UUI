import React, { useCallback, useState } from 'react';
import { FlexRow, PickerInput, FlexCell } from '@epam/promo';
import { LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui';
import { Person } from '@epam/uui-docs';

export default function SearchPositionsExample() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadPersons }, []);

    return (
        <FlexRow spacing="12">
            <FlexCell minWidth={295}>
                <PickerInput
                    dataSource={dataSource}
                    value={value}
                    onValueChange={onValueChange}
                    entityName="person"
                    selectionMode="multi"
                    valueType="id"
                />
            </FlexCell>
            <FlexCell minWidth={295}>
                <PickerInput
                    dataSource={dataSource}
                    value={value}
                    onValueChange={onValueChange}
                    entityName="person"
                    selectionMode="multi"
                    searchPosition="input"
                    valueType="id"
                />
            </FlexCell>
            <FlexCell minWidth={295}>
                <PickerInput
                    dataSource={dataSource}
                    value={value}
                    onValueChange={onValueChange}
                    entityName="person"
                    selectionMode="multi"
                    searchPosition="none"
                    valueType="id"
                />
            </FlexCell>
        </FlexRow>
    );
}
