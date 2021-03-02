import * as React from 'react';
import { Dropdown } from '@epam/uui-components';
import { Button, Panel, Text, FlexRow } from "@epam/promo";

export function CloseOpenModifiersExample() {
    const renderDropdownBody = () => {
        return (
            <Panel background='white' shadow={ true }>
                <FlexRow padding='12' vPadding='12'>
                    <Text>
                        Dropdown body content.
                    </Text>
                </FlexRow>
            </Panel>
        );
    };

    return (
        <div>
            <FlexRow spacing='12' >
                <Dropdown
                    renderBody={ () => renderDropdownBody() }
                    renderTarget={ (props: any) => <Button caption='Hover to open (toggler mode)' { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave='toggler'
                />
                <Dropdown
                    renderBody={ () => renderDropdownBody() }
                    renderTarget={ (props: any) => <Button caption='Hover to open (boundary mode)' { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave='boundary'
                />
                <Dropdown
                    renderBody={ () => renderDropdownBody() }
                    renderTarget={ (props: any) => <Button caption='Hover to open (false mode)' { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave={ false }
                />
            </FlexRow>

            <FlexRow vPadding='12' spacing='12' >
                <Dropdown
                    renderBody={ () => renderDropdownBody() }
                    renderTarget={ (props: any) => <Button caption="Click to open(Don't close on click outside)" { ...props } /> }
                    closeOnClickOutside={ false }
                />
                <Dropdown
                    renderBody={ () => renderDropdownBody() }
                    renderTarget={ (props: any) => <Button caption="Click to open(Don't close on target click)" { ...props } /> }
                    closeOnTargetClick={ false }
                />
            </FlexRow>
        </div>
    );
}