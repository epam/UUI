import React from 'react';
import { Button, DropdownContainer, FlexCell, FlexRow, LinkButton, Text } from '@epam/uui';
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
                    <FlexRow columnGap="12" vPadding="18">
                        <Button color="primary" size="30" caption="Some Action" onClick={ () => null } />
                        <Button fill="outline" size="30" color="neutral" caption="Cancel" onClick={ () => null } />
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
