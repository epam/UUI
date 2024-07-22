import React from 'react';
import { DropdownContainer, LinkButton, Text, Button, FlexRow, FlexCell } from '@epam/uui';
import { Dropdown } from '@epam/uui';
import { DropdownBodyProps, IDropdownToggler } from '@epam/uui-core';
import { ReactComponent as FigmaIcon } from '@epam/assets/icons/external_logo/figma-logo-outline-inverted.svg';

export default function BasicExample() {
    const renderFirstDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer maxWidth={ 360 } vPadding="12" padding="18" { ...props }>
                <FlexCell alignSelf="flex-start">
                    <Text fontSize="18" lineHeight="24" color="primary" fontWeight="600">
                        Some Title
                    </Text>
                    <Text fontSize="14">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem beatae delectus distinctio esse explicabo id, optio qui repellat ut veritatis!
                    </Text>
                </FlexCell>
                <FlexCell alignSelf="flex-start">
                    <FlexRow columnGap="12">
                        <Button color="primary" size="30" caption="Some Action" onClick={ () => null } />
                        <Button color="secondary" fill="outline" size="30" caption="Cancel" onClick={ () => null } />
                    </FlexRow>
                </FlexCell>
            </DropdownContainer>
        );
    };

    const renderSecondDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={ true } maxWidth={ 360 } vPadding="12" padding="18" { ...props }>
                <FlexCell alignSelf="flex-start">
                    <Text fontSize="18" lineHeight="24" color="primary" fontWeight="600">
                        Some Title
                    </Text>
                    <Text fontSize="14">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem beatae delectus distinctio esse explicabo id, optio qui repellat ut veritatis!
                    </Text>
                </FlexCell>
                <FlexCell alignSelf="flex-start">
                    <FlexRow columnGap="12">
                        <Button color="primary" size="30" caption="Some Action" onClick={ () => null } />
                        <Button color="secondary" fill="outline" size="30" caption="Cancel" onClick={ () => null } />
                    </FlexRow>
                </FlexCell>
            </DropdownContainer>
        );
    };

    return (
        <>
            <Dropdown
                renderBody={ (props) => renderFirstDropdownBody(props) }
                renderTarget={ (props: IDropdownToggler) => <LinkButton icon={ FigmaIcon } size="36" { ...props } /> }
            />
            <Dropdown
                renderBody={ (props) => renderSecondDropdownBody(props) }
                placement="right-start"
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
                renderTarget={ (props: IDropdownToggler) => <LinkButton caption="With Arrow" size="36" { ...props } /> }
            />
        </>
    );
}
