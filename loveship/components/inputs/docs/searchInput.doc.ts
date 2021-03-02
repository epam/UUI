import * as React from 'react';
import { DocBuilder, PropSamplesCreationContext, isReadonlyDoc } from '@epam/uui-docs';
import { TextInputProps } from '@epam/uui-components';
import { SearchInput, TextInputMods } from '../TextInput';
import {
    iEditable, sizeDoc, textSettingsDoc, iHasPlaceholder, onClickDoc, isDisabledDoc, isInvalidDoc, iconDoc, iconOptionsDoc, dropdownTogglerDoc,
    FormContext, GridContext, ResizableContext, DefaultContext,
} from '../../../docs';
import { IEditableDebouncerOptions } from '@epam/uui';

const SearchInputDoc = new DocBuilder<TextInputProps & TextInputMods & IEditableDebouncerOptions>({ name: 'SearchInput', component: SearchInput as React.ComponentClass<any> })
    .implements([onClickDoc, sizeDoc, textSettingsDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, iconDoc, iconOptionsDoc, iEditable, iHasPlaceholder, dropdownTogglerDoc] as any)
    .prop('value', { examples: [
        { value: 'Hello, World!', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('onAccept', { examples: (ctx: PropSamplesCreationContext) => [ctx.getCallback('onAccept')] })
    .prop('onCancel', { examples: (ctx: PropSamplesCreationContext) => [ctx.getCallback('onCancel')] })
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);
export = SearchInputDoc;