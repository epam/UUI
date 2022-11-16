import * as React from 'react';
import { allBorderStyles, allFillStyles, allEpamPrimaryColors } from '../../types';
import { Button, ButtonMods } from '../Button';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { onClickDoc, textSettingsDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder, iconWithInfoDoc, iconOptionsDoc } from '../../../docs';
import { DefaultContext, ResizableContext, FormContext } from '../../../docs';
import { colors } from '../../../helpers/colorMap';

const ButtonDoc = new DocBuilder<ButtonProps & ButtonMods>({ name: 'Button', component: Button })
    .prop('size', { examples: ['18', "24", "30", "36", "42", "48"] , defaultValue: '36' })
    .implements([textSettingsDoc, onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder])
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: [...allEpamPrimaryColors.filter(color => color !== 'sun'), 'white', 'night500'],
    })
    .prop('caption', { examples:  [
        { value: 'Click me', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .implements([iconWithInfoDoc, iconOptionsDoc])
    .prop('shape', { examples: allBorderStyles, defaultValue: 'square' })
    .prop('fill', { examples: allFillStyles, defaultValue: 'solid' })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export = ButtonDoc;