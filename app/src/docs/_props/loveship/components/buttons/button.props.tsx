import * as React from 'react';
import { allBorderStyles, allFillStyles, allEpamPrimaryColors } from '@epam/loveship';
import { Button, ButtonMods } from '@epam/loveship';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import {
    basicPickerTogglerDoc,
    DefaultContext,
    dropdownTogglerDoc,
    FormContext,
    iCanRedirectDoc,
    iconOptionsDoc,
    iconWithInfoDoc,
    iHasPlaceholder,
    isDisabledDoc,
    onClickDoc,
    ResizableContext,
} from '../../docs';
import { colors } from '../../docs/helpers/colorMap';

const ButtonDoc = new DocBuilder<ButtonProps & ButtonMods>({ name: 'Button', component: Button })
    .prop('size', {
        examples: [
            '18',
            '24',
            '30',
            '36',
            '42',
            '48',
        ],
        defaultValue: '36',
    })
    .implements([
        onClickDoc,
        dropdownTogglerDoc,
        isDisabledDoc,
        basicPickerTogglerDoc,
        iCanRedirectDoc,
        iHasPlaceholder,
    ])
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: [
            ...allEpamPrimaryColors.filter((color) => color !== 'sun'),
            'white',
            'night500',
        ],
    })
    .prop('caption', {
        examples: [
            { value: 'Click me', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .implements([iconWithInfoDoc, iconOptionsDoc])
    .prop('shape', { examples: allBorderStyles, defaultValue: 'square' })
    .prop('fill', { examples: allFillStyles, defaultValue: 'solid' })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default ButtonDoc;
