import React from 'react';
import { Dropdown } from '@epam/uui-components';
import { IDropdownToggler, DropdownBodyProps } from '@epam/uui-core';
import {
    Text, FlexRow, DropdownContainer, FlexCell, LinkButton, Avatar,
} from '@epam/promo';
import css from './HandleStateExample.module.scss';

export default function DelayForOpenAndCloseExample() {
    const renderDropdownBody = (props: DropdownBodyProps, name: string) => {
        return (
            <DropdownContainer vPadding="24" padding="18" { ...props }>
                <FlexRow alignItems="center" spacing="12">
                    <Avatar size="48" alt="avatar" img={ `https://avatars.dicebear.com/api/human/${name}.svg?background=%23EBEDF5&radius=50` } />

                    <FlexCell width="100%">
                        <Text cx={ css.text } lineHeight="24" fontSize="16" color="gray80" font="sans-semibold">
                            {name}
                        </Text>
                        <Text cx={ css.text } lineHeight="18" fontSize="12" color="gray60">
                            Corporate Function Management | L3
                        </Text>
                    </FlexCell>
                </FlexRow>
            </DropdownContainer>
        );
    };

    const renderTarget = (props: IDropdownToggler, name: string) => {
        return (
            <FlexRow columnGap="6" size="24" { ...props }>
                <Avatar size="18" alt="avatar" img={ `https://avatars.dicebear.com/api/human/${name}.svg?background=%23EBEDF5&radius=50` } />
                <LinkButton size="30" caption={ name } />
            </FlexRow>
        );
    };

    return (
        <div>
            <Dropdown
                renderBody={ (props) => renderDropdownBody(props, 'Ann Zaharova') }
                renderTarget={ (props) => renderTarget(props, 'Ann Zaharova') }
                openOnHover={ true }
                openDelay={ 500 }
                closeDelay={ 100 }
                closeOnMouseLeave="toggler"
            />
            <Dropdown
                renderBody={ (props) => renderDropdownBody(props, 'Alexander Sozonov') }
                renderTarget={ (props) => renderTarget(props, 'Alexander Sozonov') }
                openOnHover={ true }
                openDelay={ 500 }
                closeDelay={ 100 }
                closeOnMouseLeave="toggler"
            />
            <Dropdown
                renderBody={ (props) => renderDropdownBody(props, 'Petter Drummer') }
                renderTarget={ (props) => renderTarget(props, 'Petter Drummer') }
                openOnHover={ true }
                openDelay={ 500 }
                closeDelay={ 100 }
                closeOnMouseLeave="toggler"
            />
        </div>
    );
}
