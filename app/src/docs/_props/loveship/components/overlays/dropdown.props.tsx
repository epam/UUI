import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { Dropdown } from '@epam/uui-components';
import { DropdownProps } from '@epam/uui-core';
import {
    DropdownMenuItemMods, DropdownMenuButton, Button, DropdownMenuSplitter, DropdownMenuBody, DropdownMenuHeader,
} from '@epam/loveship';
import { DefaultContext } from '../../docs';

const dropdownMenuDoc = new DocBuilder<DropdownProps & DropdownMenuItemMods>({ name: 'Dropdown', component: Dropdown })
    .prop('renderBody', {
        isRequired: true,
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
        isRequired: true,
        examples: [
            {
                value: (props) => <Button caption="Target" { ...props } />,
                isDefault: true,
            },
        ],
    })
    .prop('openOnClick', {
        examples: [true, false],
        defaultValue: true,
        remountOnChange: true,
    })
    .prop('openOnHover', {
        examples: [true, false],
        defaultValue: false,
        remountOnChange: true,
    })
    .prop('closeOnClickOutside', {
        examples: [true, false],
        defaultValue: true,
        remountOnChange: true,
    })
    .prop('closeOnTargetClick', {
        examples: [true, false],
        defaultValue: true,
        remountOnChange: true,
    })
    .prop('closeOnMouseLeave', {
        examples: [
            'toggler', 'boundary', false,
        ],
        defaultValue: false,
        remountOnChange: true,
    })
    .prop('openDelay', {
        examples: [
            500, 1000, 1500, 2000,
        ],
        defaultValue: 0,
    })
    .prop('closeDelay', {
        examples: [
            500, 1000, 1500, 2000,
        ],
        defaultValue: 0,
    })
    .withContexts(DefaultContext);

export default dropdownMenuDoc;
