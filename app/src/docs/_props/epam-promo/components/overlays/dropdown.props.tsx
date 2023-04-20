import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { Dropdown } from '@epam/uui-components';
import { DropdownProps } from '@epam/uui-core';
import {
    Button, Panel, FlexRow, Text,
} from '@epam/promo';
import { DefaultContext } from '../../docs';

const dropdownMenuDoc = new DocBuilder<DropdownProps>({ name: 'Dropdown', component: Dropdown })
    .prop('renderBody', {
        isRequired: true,
        examples: [
            {
                value: () => {
                    return (
                        <Panel background="white" shadow={ true }>
                            <FlexRow padding="12" vPadding="12">
                                <Text>Dropdown body content. You can use any components as a dropdown body.</Text>
                            </FlexRow>
                        </Panel>
                    );
                },
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
            'toggler',
            'boundary',
            false,
        ],
        defaultValue: false,
        remountOnChange: true,
    })
    .prop('openDelay', {
        examples: [
            500,
            1000,
            1500,
            2000,
        ],
        defaultValue: 0,
    })
    .prop('closeDelay', {
        examples: [
            500,
            1000,
            1500,
            2000,
        ],
        defaultValue: 0,
    })
    .prop('onValueChange', { examples: (ctx) => [{ value: ctx.getChangeHandler('onValueChange'), name: '(newValue) => { ... }' }] })
    .prop('value', { examples: [true, false] })
    .withContexts(DefaultContext);

export default dropdownMenuDoc;
