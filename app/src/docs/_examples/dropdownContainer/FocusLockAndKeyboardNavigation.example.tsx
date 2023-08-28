import React from 'react';
import { Button, DropdownContainer, FlexCell, FlexRow, LinkButton, Text } from '@epam/promo';
import { Dropdown } from '@epam/uui-components';
import { DropdownBodyProps, IDropdownToggler } from '@epam/uui-core';

export default function FocusLockAndKeyboardNavigationExample() {
    const renderFirstDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer
                maxWidth={ 360 }
                vPadding="12"
                padding="18"
                focusLock={ false }
                closeOnEsc={ false }
                { ...props }
            >
                <Text fontSize="14">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem beatae delectus distinctio esse explicabo id, optio qui repellat ut veritatis!
                </Text>
                <FlexCell>
                    <FlexRow spacing="12">
                        <Button color="green" size="30" caption="Some Action" onClick={ () => null } />
                        <Button fill="white" size="30" color="gray" caption="Cancel" onClick={ () => null } />
                    </FlexRow>
                </FlexCell>
            </DropdownContainer>
        );
    };

    return (
        <Dropdown
            renderBody={ (props) => renderFirstDropdownBody(props) }
            renderTarget={ (props: IDropdownToggler) => <LinkButton caption="Toggler" size="36" { ...props } /> }
        />
    );
}
