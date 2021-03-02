import * as React from 'react';
import { DocBuilder, PropSamplesCreationContext } from '@epam/uui-docs';
import { TextInputProps } from '@epam/uui-components';
import { TextInput, TextInputMods } from '../TextInput';
import { iEditable, textSettingsDoc, iHasPlaceholder, onClickDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, iconDoc, iconOptionsDoc, dropdownTogglerDoc, modeDoc } from '../../../docs';
import { DefaultContext, ResizableContext, GridContext, FormContext } from '../../../docs';

const TextInputDoc = new DocBuilder<TextInputProps & TextInputMods>({ name: 'TextInput', component: TextInput as React.ComponentClass<any> })
    .prop('size', { examples: ['60', '48', '42', '36', '30', '24'], defaultValue: '36' })
    .implements([textSettingsDoc, onClickDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, iconDoc, iconOptionsDoc, iEditable, iHasPlaceholder, dropdownTogglerDoc, modeDoc] as any)
    .prop('maxLength', { examples: [10, 20, 30], type: 'number' })
    .prop('value', { examples: [
        { value: 'Hello, World!', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('onAccept', { examples: (ctx: PropSamplesCreationContext) => [ctx.getCallback('onAccept')] })
    .prop('onCancel', { examples: (ctx: PropSamplesCreationContext) => [ctx.getCallback('onCancel')] })
    .prop('type', { examples: ['text', 'password'], type: 'string', defaultValue: 'text' })
    .withContexts(DefaultContext, ResizableContext, GridContext, FormContext);

export = TextInputDoc;