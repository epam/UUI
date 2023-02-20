import { allButtonModes } from '@epam/uui';
import { allButtonColors, Button, ButtonMods } from '@epam/uui';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder, iconOptionsDoc } from '../../docs';
import { DefaultContext } from '../../docs';
import * as React from 'react';

const ButtonDoc = new DocBuilder<ButtonProps & ButtonMods>({ name: 'Button', component: Button })
    .prop('size', { examples: ['24', '30', '36', '42', '48'], defaultValue: '36' })
    .implements([onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder] as any)
    .prop('color', {
        renderEditor: (editable: any, examples) => <ColorPicker colors={examples.map(i => ({ value: i }))} {...editable} />,
        examples: allButtonColors,
    })
    .prop('caption', {
        examples: [
            { value: 'Click me', isDefault: true },
            {
                name: 'long text',
                value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa',
            },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .implements([iconOptionsDoc] as any)
    .prop('mode', { examples: allButtonModes, defaultValue: 'solid' })
    .withContexts(DefaultContext);

export default ButtonDoc;
