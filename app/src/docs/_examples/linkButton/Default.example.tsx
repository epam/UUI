import React from 'react';
import { IDropdownToggler } from '@epam/uui-core';
import { Dropdown, DropdownMenuBody, DropdownMenuButton, LinkButton, Panel, Text } from '@epam/uui';
import { ReactComponent as navigationBack } from '@epam/assets/icons/common/navigation-back-18.svg';
import css from './DefaultExample.module.scss';

export default function DefaultLinkButtonExample() {
    const renderDropdownBody = () => <DropdownMenuBody><DropdownMenuButton caption="Dropdown body" /></DropdownMenuBody>;

    return (
        <div className={ css.wrapper }>
            <Panel background="surface-main" cx={ css.components }>
                <LinkButton caption="VIEW DETAILS" link={ { pathname: '/' } } />
                <LinkButton caption="BACK TO CATALOG" link={ { pathname: '/' } } icon={ navigationBack } />
                <Dropdown renderBody={ renderDropdownBody } renderTarget={ (props: IDropdownToggler) => <LinkButton caption="SORT BY" { ...props } /> } />
            </Panel>

            <Panel background="surface-main" cx={ css.descriptions }>
                <Text>Simple action. Can also be used for redirection</Text>
                <Text>Different icons support the meaning of an action. Can be used for a redirection or action</Text>
                <Text>Chevron-down icon on the right makes a link button a toggler for Dropdowns</Text>
            </Panel>
        </div>
    );
}
