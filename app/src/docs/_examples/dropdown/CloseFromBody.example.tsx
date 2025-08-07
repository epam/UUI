import React from 'react';
import { Dropdown } from '@epam/uui-components';
import { DropdownBodyProps } from '@epam/uui-core';
import { Button, Text, FlexRow, DropdownContainer, FlexCell } from '@epam/uui';
import { IDropdownToggler } from '@epam/uui-core';
import { offset } from '@floating-ui/react';

export default function BasicDropdownExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer maxWidth={ 360 } vPadding="24" padding="18" { ...props }>
                <FlexCell alignSelf="flex-start">
                    <Text fontSize="18" lineHeight="24" color="primary">
                        Some Title
                    </Text>
                    <Text fontSize="14">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem beatae delectus distinctio esse explicabo id, optio qui repellat ut veritatis!
                    </Text>
                </FlexCell>
                <FlexCell alignSelf="flex-start">
                    <FlexRow columnGap="12">
                        <Button color="primary" size="30" caption="Some Action" onClick={ () => null } />
                        <Button fill="outline" size="30" color="secondary" caption="Cancel" onClick={ () => props.onClose() } />
                    </FlexRow>
                </FlexCell>
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderBody={ renderDropdownBody }
            renderTarget={ (props: IDropdownToggler) => <Button caption="Click to open" { ...props } /> }
            middleware={ [offset(6)] }
        />
    );
}
