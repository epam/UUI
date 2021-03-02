import { allBorderStyles, allFillStyles } from '../../types';
import { Button, ButtonMods } from '../Button';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { onClickDoc, textSettingsDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder, colorDoc, iconWithInfoDoc, iconOptionsDoc } from '../../../docs';
import { DefaultContext, ResizableContext, FormContext, GridContext } from '../../../docs';

const ButtonDoc = new DocBuilder<ButtonProps & ButtonMods>({ name: 'Button', component: Button })
    .prop('size', { examples: ['18', "24", "30", "36", "42", "48"] , defaultValue: '36' })
    .implements([textSettingsDoc, onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iCanRedirectDoc, iHasPlaceholder, colorDoc] as any)
    .prop('caption', { examples:  [
        { value: 'Click me', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .implements([iconWithInfoDoc, iconOptionsDoc] as any)
    .prop('shape', { examples: allBorderStyles, defaultValue: 'square' })
    .prop('fill', { examples: allFillStyles, defaultValue: 'solid' })
    .withContexts(DefaultContext, ResizableContext, FormContext, GridContext);

export = ButtonDoc;