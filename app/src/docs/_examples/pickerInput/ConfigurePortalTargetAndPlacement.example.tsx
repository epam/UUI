import React, { useState, useCallback, useRef } from 'react';
import { PickerInput, DropdownContainer, FlexCell, FlexRow, Button, Dropdown, Text, Panel } from '@epam/uui';
import { IDropdownToggler, LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui-core';
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
        <DropdownContainer
            { ...props }
            showArrow={ true }
            maxWidth={ 360 }
            closeOnEsc={ false }
            shards={ [portalTargetRef] }
        >
            <Panel background="surface-main">
                <FlexRow alignItems="top" padding="18" vPadding="24">
                    <FlexCell grow={ 1 } ref={ portalTargetRef }>
                        <Text fontSize="18" lineHeight="24" color="primary">
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
                            maxItems={ 3 }
                            portalTarget={ portalTargetRef.current }
                        />
                    </FlexCell>
                </FlexRow>
                <div className={ css.divider }></div>
                <FlexRow columnGap="12" padding="18" vPadding="24">
                    <Button color="primary" size="30" caption="Save" onClick={ () => null } />
                    <Button fill="outline" size="30" color="secondary" caption="Cancel" onClick={ () => props.onClose() } />
                </FlexRow>
            </Panel>
        </DropdownContainer>
    );

    return (
        <div>
            <Dropdown renderBody={ renderDropdownBody } renderTarget={ (props: IDropdownToggler) => <Button caption="Click to open" { ...props } /> } />
        </div>
    );
}
