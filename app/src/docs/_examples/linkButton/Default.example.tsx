import React from 'react';
import { IDropdownToggler } from '@epam/uui-core';
import { Dropdown, DropdownMenuBody, DropdownMenuButton, FlexCell, FlexRow, LinkButton, Panel, Text } from '@epam/uui';
import { ReactComponent as navigationBack } from '@epam/assets/icons/common/navigation-back-18.svg';
import css from './DefaultExample.module.scss';

export default function DefaultLinkButtonExample() {
    const renderDropdownBody = () => <DropdownMenuBody><DropdownMenuButton caption="Dropdown body" /></DropdownMenuBody>;

    return (
        <div className={ css.wrapper }>
            <Panel background="surface-main" cx={ css.components }>
                <FlexRow columnGap="12">
                    <FlexCell cx={ css.link } width={ 160 }>
                        <LinkButton caption="VIEW DETAILS" link={ { pathname: '/' } } />
                    </FlexCell>
                    <Text>Simple action. Can also be used for redirection</Text>
                </FlexRow>
                <FlexRow columnGap="12">
                    <FlexCell cx={ css.link } width={ 160 }>
                        <LinkButton caption="BACK TO CATALOG" link={ { pathname: '/' } } icon={ navigationBack } />
                    </FlexCell>
                    <Text>Different icons support the meaning of an action. Can be used for a redirection or action</Text>
                </FlexRow>
                <FlexRow columnGap="12">
                    <FlexCell cx={ css.link } width={ 160 }>
                        <Dropdown renderBody={ renderDropdownBody } renderTarget={ (props: IDropdownToggler) => <LinkButton caption="SORT BY" { ...props } /> } />
                    </FlexCell>
                    <Text>Chevron-down icon on the right makes a link button a toggler for Dropdowns</Text>
                </FlexRow>
            </Panel>
        </div>
    );
}
