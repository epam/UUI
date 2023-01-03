import React from 'react';
import { Dropdown, DropdownContainer, LinkButton, Panel, Text } from '@epam/promo';
import { DropdownBodyProps } from '@epam/uui-components';
import { IDropdownToggler } from '@epam/uui';
import { ReactComponent as navigationBack } from '@epam/assets/icons/common/navigation-back-18.svg';
import css from './DefaultExample.scss';

export default function DefaultLinkButtonExample() {
    const renderDropdownBody = (props: DropdownBodyProps) => <DropdownContainer { ...props } />;

    return (
        <>
            <Panel cx={ css.components }>
                <LinkButton caption='view details' link={ { pathname: '/' } } captionCX={ css.caption } />
                <LinkButton caption='back to catalog' link={ { pathname: '/' } } captionCX={ css.caption }
                    icon={ navigationBack } />
                <Dropdown
                    renderBody={ renderDropdownBody }
                    renderTarget={ (props: IDropdownToggler) => <LinkButton caption='sort by' captionCX={ css.caption }
                    { ...props } /> }
                />
            </Panel>

            <Panel cx={ css.descriptions }>
                <Text>Simple action. Can be used for redirection also</Text>
                <Text>Different icons support meaning of an action. Can be used for redirection or action</Text>
                <Text>Chevron-down icon on the right applies use a link button as a trigger for Picker Dropdown or other overlay component (dropdown menu, popover)</Text>
            </Panel>
        </>
    );
}