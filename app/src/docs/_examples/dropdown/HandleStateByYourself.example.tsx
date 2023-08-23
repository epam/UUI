import React, { useState } from 'react';
import { Dropdown } from '@epam/uui-components';
import { Text, FlexRow, DropdownContainer, LinkButton, FlexCell, Avatar } from '@epam/uui';
import { IDropdownToggler, DropdownBodyProps } from '@epam/uui-core';
import css from './HandleStateExample.module.scss';

export default function BasicDropdownExample() {
    const [value, onValueChange] = useState(null);

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={ true } vPadding="24" padding="18" { ...props }>
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
        <Dropdown
            renderBody={ (props) => renderDropdownBody(props) }
            placement="bottom-start"
            renderTarget={ (props: IDropdownToggler) => <LinkButton caption="Click to open" size="36" { ...props } /> }
            value={ value }
            onValueChange={ onValueChange }
        />
    );
}
