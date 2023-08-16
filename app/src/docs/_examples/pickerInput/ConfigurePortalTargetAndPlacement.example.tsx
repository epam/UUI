import React, {
    useState, useCallback, useRef,
} from 'react';
import {
    PickerInput, DropdownContainer, FlexCell, FlexRow, Button, Dropdown, Text, Panel,
} from '@epam/promo';
import {
    IDropdownToggler, LazyDataSourceApiRequest, useLazyDataSource, useUuiContext,
} from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import { DropdownBodyProps } from '@epam/uui-core';
import css from './PickerInputInDropdown.module.scss';

export default function ConfigurePortalTargetAndPlacement() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>([]);
    const portalTargetRef = useRef<HTMLDivElement>(null);

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({ api: loadPersons }, []);

    const renderDropdownBody = (props: DropdownBodyProps) => (
        <DropdownContainer showArrow={ true } maxWidth={ 360 } { ...props }>
            <Panel>
                <FlexRow alignItems="top" padding="18" vPadding="24">
                    <FlexCell grow={ 1 }>
                        <Text fontSize="18" lineHeight="24" color="gray90" font="museo-slab">
                            Reporting to
                        </Text>
                        <PickerInput
                            dataSource={ dataSource }
                            value={ value }
                            onValueChange={ onValueChange }
                            entityName="person"
                            selectionMode="multi"
                            valueType="id"
                            dropdownPlacement="right-start"
                            portalTarget={ portalTargetRef.current }
                        />
                    </FlexCell>
                </FlexRow>
                <div className={ css.divider }></div>
                <FlexRow spacing="12" padding="18" vPadding="24">
                    <Button color="green" size="30" caption="Save" onClick={ () => null } />
                    <Button fill="white" size="30" color="gray" caption="Cancel" onClick={ () => props.onClose() } />
                </FlexRow>
            </Panel>
        </DropdownContainer>
    );

    return (
        <div ref={ portalTargetRef }>
            <Dropdown renderBody={ renderDropdownBody } renderTarget={ (props: IDropdownToggler) => <Button caption="Click to open" { ...props } /> } />
        </div>
    );
}
