import React, { useState } from 'react';
import { Dropdown, DropdownBodyProps } from '@epam/uui-components';
import { Text, FlexRow, DropdownContainer, LinkButton, FlexCell } from "@epam/promo";
import { Avatar, IDropdownToggler } from "@epam/uui";
import css from './HandleStateExample.scss';


export default function BasicDropdownExample() {
    const [value, onValueChange] = useState(null);

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={ true } vPadding="24" padding="18" { ...props }>
                <FlexRow alignItems="center" spacing='12'>
                    <Avatar
                        size="48"
                        alt="avatar"
                        img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                    />

                    <FlexCell width="100%">
                        <Text cx={ css.text } lineHeight="24" fontSize="16" color="gray80" font="sans-semibold">John Doe</Text>
                        <Text cx={ css.text } lineHeight="18" fontSize="12" color="gray60">Corporate Function Management | L3</Text>
                    </FlexCell>
                </FlexRow>
            </DropdownContainer>

        );
    };

    return (
        <>
            <Dropdown
                renderBody={ (props) => renderDropdownBody(props) } placement="bottom-start"
                renderTarget={ (props: IDropdownToggler) => <LinkButton caption="Click to open"
                                                                        size="36" { ...props } /> }
                value={ value }
                onValueChange={ onValueChange }
            />
        </>
    );
}
