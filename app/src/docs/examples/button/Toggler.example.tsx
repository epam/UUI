import React, {useCallback, useState} from "react";
import { Button, FlexRow, Panel, Tooltip, PickerInput } from '@epam/promo';
import { Dropdown } from '@epam/uui-components';
import { useLazyDataSource, LazyDataSourceApiRequest } from '@epam/uui';
import { Person } from "@epam/uui-docs";
import { svc } from "../../../services";


export function ButtonAsToggler() {
    const [value, onValueChange] = useState<number[]>();

    const personsApi = useCallback((request: LazyDataSourceApiRequest<Person, number>) => svc.api.demo.persons(request), []);

    const dataSource = useLazyDataSource({
        api: personsApi,
    });

    return (
        <FlexRow spacing='12' >
            <Dropdown
                renderBody={ (props) => <Panel { ...props } background='white'>some dropdown content</Panel> }
                renderTarget={ (props) => <Button caption='Dropdown' { ...props } /> }
            />

            <Tooltip content='some text'>
                <Button caption='Tooltip' />
            </Tooltip>

            <PickerInput
                renderToggler={ (props) => <Button { ...props } caption='Picker' /> }
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