import * as React from 'react';
import { allButtonColors, Button, ButtonProps } from '../Button';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc,
    iHasPlaceholder, iconWithInfoDoc, iconOptionsDoc,  DefaultContext, FormContext } from '../../../docs';
import { colors } from '../../../helpers/colorMap';
import { allFillStyles } from "../../types";

const ButtonDoc = new DocBuilder<ButtonProps>({ name: 'Button', component: Button })
    .implements([onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder])
    .prop('size', { examples: ['24', '30', '36', '42', '48'] , defaultValue: '36' })
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: allButtonColors,
    })
    .prop('caption', { examples:  [
            { value: 'Click me', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ], type: 'string' })
    .implements([iconWithInfoDoc, iconOptionsDoc])
    .prop('fill', { examples: allFillStyles, defaultValue: 'solid' })
    .withContexts(DefaultContext, FormContext);

export default ButtonDoc;
