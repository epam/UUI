import React from 'react';
import { Dropdown, DropdownContainerProps } from '@epam/uui-components';
import { IDropdownToggler } from '@epam/uui-core';
import { Button, Text, FlexRow, DropdownContainer, FlexCell, Avatar } from '@epam/uui';
import css from './HandleStateExample.module.scss';

export default function CloseOpenModifiersExample() {
    const renderDropdownBody = (props: DropdownContainerProps) => {
        return (
            <DropdownContainer vPadding="24" padding="18" { ...props }>
                <FlexRow alignItems="center" spacing="12">
                    <Avatar size="48" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />

                    <FlexCell width="100%">
                        <Text cx={ css.text } lineHeight="24" fontSize="16" color="primary" font="semibold">
                            John Doe
                        </Text>
                        <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                            Corporate Function Management | L3
                        </Text>
                    </FlexCell>
                </FlexRow>
            </DropdownContainer>
        );
    };

    return (
        <div>
            <FlexRow spacing="12">
                <Dropdown
                    renderBody={ (props) => renderDropdownBody({ ...props, focusLock: false }) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (toggler mode)" { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave="toggler"
                />
                <Dropdown
                    renderBody={ (props) => renderDropdownBody({ ...props, focusLock: false }) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (boundary mode)" { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave="boundary"
                />
                <Dropdown
                    renderBody={ (props) => renderDropdownBody({ ...props, focusLock: false }) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (false mode)" { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave={ false }
                />
            </FlexRow>

            <FlexRow vPadding="12" spacing="12">
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Click to open(Don't close on click outside)" { ...props } /> }
                    closeOnClickOutside={ false }
                />
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Click to open(Don't close on target click)" { ...props } /> }
                    closeOnTargetClick={ false }
                />
            </FlexRow>
        </div>
    );
}
