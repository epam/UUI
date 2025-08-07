import React, { useState } from 'react';
import { Dropdown } from '@epam/uui-components';
import { Text, FlexRow, DropdownContainer, LinkButton, FlexCell, Avatar } from '@epam/uui';
import { IDropdownToggler, DropdownBodyProps } from '@epam/uui-core';
import css from './HandleStateExample.module.scss';
import { offset } from '@floating-ui/react';

export default function BasicDropdownExample() {
    const [value, onValueChange] = useState(null);

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={ true } vPadding="24" padding="18" { ...props }>
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
        <Dropdown
            renderBody={ (props) => renderDropdownBody(props) }
            placement="bottom-start"
            renderTarget={ (props: IDropdownToggler) => <LinkButton caption="Click to open" size="36" { ...props } /> }
            value={ value }
            onValueChange={ onValueChange }
            middleware={ [offset(6)] }
        />
    );
}
