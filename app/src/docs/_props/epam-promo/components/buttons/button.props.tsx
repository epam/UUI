import * as React from 'react';
import { allFillStyles, Button } from '@epam/promo';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/promo';
import { onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder, iconWithInfoDoc, iconOptionsDoc, DefaultContext, FormContext } from '../../docs';

const colors = {
    blue: '#008ACE',
    green: '#88CC00',
    red: '#E54322',
    gray: '#6C6F80',
    gray50: '#6C6F80',
};

const allButtonColors = ['blue', 'green', 'red', 'gray'];

const ButtonDoc = new DocBuilder<ButtonProps>({ name: 'Button', component: Button })
    .prop('size', {
        examples: [
            '24', '30', '36', '42', '48',
        ],
        defaultValue: '36',
    })
    .implements([
        onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder,
    ])
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: allButtonColors as any,
    })
    .prop('caption', {
        examples: [
            { value: 'Click me', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .implements([iconWithInfoDoc, iconOptionsDoc])
    .prop('fill', { examples: allFillStyles, defaultValue: 'solid' })
    .withContexts(DefaultContext, FormContext);

export default ButtonDoc;
