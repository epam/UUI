import React, { useState } from 'react';
import { Dropdown, DropdownBodyProps } from '@epam/uui-components';
import { LinkButton, Button, Panel, Text, FlexRow } from "@epam/promo";
import { IDropdownToggler } from '@epam/uui';

export default function BasicDropdownExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <Panel background='white' shadow={ true }>
                <FlexRow padding='12' vPadding='12'>
                    <Text>Dropdown body content.</Text>
                    <LinkButton caption='Click to close' onClick={ props.onClose } />
                </FlexRow>
            </Panel>
        );
    };

    return (
        <>
            <Dropdown
                renderBody={ renderDropdownBody }
                renderTarget={ (props: IDropdownToggler) => <Button caption='Click to open' { ...props } /> }
            />
        </>
    );
}