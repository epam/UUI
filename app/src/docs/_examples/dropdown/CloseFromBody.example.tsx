import React from 'react';
import { Dropdown } from '@epam/uui-components';
import { DropdownBodyProps } from '@epam/uui-core';
import { Button, Text, FlexRow, DropdownContainer, FlexCell } from '@epam/promo';
import { IDropdownToggler } from '@epam/uui';

export default function BasicDropdownExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer maxWidth={360} vPadding="24" padding="18" {...props}>
                <FlexCell alignSelf="flex-start">
                    <Text fontSize="18" lineHeight="24" color="gray90" font="museo-slab">
                        Some Title
                    </Text>
                    <Text fontSize="14">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem beatae delectus distinctio esse explicabo id, optio qui
                        repellat ut veritatis!
                    </Text>
                </FlexCell>
                <FlexCell alignSelf="flex-start">
                    <FlexRow spacing="12">
                        <Button color="green" size="30" caption="Some Action" onClick={() => null} />
                        <Button fill="white" size="30" color="gray50" caption="Cancel" onClick={() => props.onClose()} />
                    </FlexRow>
                </FlexCell>
            </DropdownContainer>
        );
    };

    return (
        <>
            <Dropdown renderBody={renderDropdownBody} renderTarget={(props: IDropdownToggler) => <Button caption="Click to open" {...props} />} />
        </>
    );
}
