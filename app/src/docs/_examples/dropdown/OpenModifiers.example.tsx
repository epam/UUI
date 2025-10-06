import React from 'react';
import { Dropdown, DropdownContainerProps } from '@epam/uui-components';
import { IDropdownToggler } from '@epam/uui-core';
import { Button, Text, FlexRow, DropdownContainer, FlexCell, Avatar } from '@epam/uui';
import css from './HandleStateExample.module.scss';
import { offset } from '@floating-ui/react';

export default function OpenModifiersExample() {
    const renderDropdownBody = (props: DropdownContainerProps) => {
        return (
            <DropdownContainer focusLock={ false } vPadding="24" padding="18" { ...props }>
                <FlexRow alignItems="center" columnGap="12">
                    <Avatar size="48" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />

                    <FlexCell width="100%">
                        <Text cx={ css.text } lineHeight="24" fontSize="16" color="primary" fontWeight="600">
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
            <FlexRow vPadding="12" columnGap="12">
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Click to open" { ...props } /> }
                    middleware={ [offset(6)] }
                />
            </FlexRow>

            <FlexRow columnGap="12">
                <Dropdown
                    renderBody={ (props) => renderDropdownBody({ ...props, focusLock: false }) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (toggler mode)" { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave="toggler"
                    middleware={ [offset(6)] }
                />
                <Dropdown
                    renderBody={ (props) => renderDropdownBody({ ...props, focusLock: false }) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (boundary mode)" { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave="boundary"
                    closeDelay={ 1000 }
                    middleware={ [offset(6)] }
                />
                <Dropdown
                    renderBody={ (props) => renderDropdownBody({ ...props, focusLock: false }) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Hover to open (false mode)" { ...props } /> }
                    openOnHover={ true }
                    closeOnMouseLeave={ false }
                    middleware={ [offset(6)] }
                />
            </FlexRow>

            <FlexRow vPadding="12" columnGap="12">
                <Dropdown
                    renderBody={ (props) => renderDropdownBody(props) }
                    renderTarget={ (props: IDropdownToggler) => <Button caption="Focus to open" { ...props } /> }
                    openOnFocus={ true }
                    middleware={ [offset(6)] }
                />
            </FlexRow>
        </div>
    );
}
