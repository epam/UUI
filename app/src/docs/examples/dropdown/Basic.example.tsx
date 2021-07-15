import React from 'react';
import { Dropdown } from '@epam/uui-components';
import { Button, Panel, Text, FlexRow } from "@epam/promo";
import { IDropdownToggler } from '@epam/uui';

export default function BasicDropdownExample() {
    const renderDropdownBody = () => {
        return (
            <Panel background='white' shadow={ true }>
                <FlexRow padding='12' vPadding='12'>
                    <Text>
                        Dropdown body content.
                        You can use any components as a dropdown body.
                    </Text>
                </FlexRow>
            </Panel>
        );
    };

    return (
        <>
            <Dropdown
                renderBody={ () => renderDropdownBody() }
                renderTarget={ (props: IDropdownToggler) => <Button caption='Click to open' { ...props } /> }
            />

            <Dropdown
                renderBody={ () => renderDropdownBody() }
                renderTarget={ (props: IDropdownToggler) => <Button caption='Hover to open' { ...props } /> }
                openOnHover={ true }
                closeOnMouseLeave='toggler'
            />
        </>
    );
}