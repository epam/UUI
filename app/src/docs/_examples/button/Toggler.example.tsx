import React, { useCallback, useState } from 'react';
import { Button, FlexRow, Tooltip, PickerInput, DropdownMenuBody, DropdownMenuButton } from '@epam/uui';
import { Dropdown } from '@epam/uui-components';
import { useLazyDataSource, LazyDataSourceApiRequest, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

export default function ButtonAsToggler() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const personsApi = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: personsApi }, []);

    return (
        <FlexRow columnGap="12">
            <Dropdown
                renderBody={ (props) => (
                    <DropdownMenuBody { ...props }>
                        <DropdownMenuButton caption="Some dropdown content" onClick={ () => window.alert('onClick') } />
                    </DropdownMenuBody>
                ) }
                renderTarget={ (props) => <Button caption="Dropdown" { ...props } /> }
            />

            <Tooltip content="some text">
                <Button caption="Tooltip" />
            </Tooltip>

            <PickerInput
                renderToggler={ (props) => <Button { ...props } caption="Picker" /> }
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName="person"
                selectionMode="multi"
                valueType="id"
            />
        </FlexRow>
    );
}
