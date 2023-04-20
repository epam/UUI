import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { Dropdown } from '@epam/uui-components';
import { DropdownProps } from '@epam/uui-core';
import {
    DropdownMenuItemMods, DropdownMenuButton, MainMenuButton, DropdownMenuSplitter, DropdownMenuBody, DropdownMenuHeader,
} from '@epam/loveship';
import { DefaultContext, MainMenuContext } from '../../docs';

const dropdownMenuDoc = new DocBuilder<DropdownProps & DropdownMenuItemMods>({ name: 'DropdownMenu', component: Dropdown })
    .prop('renderBody', {
        examples: [
            {
                value: () => (
                    <DropdownMenuBody>
                        <DropdownMenuHeader title="Tools" />
                        <DropdownMenuButton caption="Button111" />
                        <DropdownMenuButton caption="Button2" />
                        <DropdownMenuButton caption="Button3232" />
                        <DropdownMenuSplitter />
                        <DropdownMenuButton caption="Button2" />
                        <DropdownMenuButton caption="Button323442" />
                    </DropdownMenuBody>
                ),
                isDefault: true,
            },
        ],
    })
    .prop('renderTarget', {
        examples: [
            {
                value: (props) => <MainMenuButton caption="Toggler" { ...props } />,
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .withContexts(MainMenuContext, DefaultContext);

export default dropdownMenuDoc;
