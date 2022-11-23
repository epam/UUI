import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { TextInputProps } from '@epam/uui-components';
import { TextInputMods, SearchInput } from '../TextInput';
import { IEditableDebouncerOptions } from '@epam/uui-core';
import {
    iEditable, sizeDoc, textSettingsDoc, iHasPlaceholder, onClickDoc, isDisabledDoc, isInvalidDoc, iconDoc, iconOptionsDoc, dropdownTogglerDoc,
    FormContext, GridContext, ResizableContext, DefaultContext,
} from '../../../docs';

const SearchInputDoc = new DocBuilder<TextInputProps & TextInputMods & IEditableDebouncerOptions>({ name: 'SearchInput', component: SearchInput as any })
    .implements([onClickDoc, sizeDoc, textSettingsDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, iconDoc, iconOptionsDoc, iEditable, iHasPlaceholder, dropdownTogglerDoc])
    .prop('value', { examples: [
        { value: 'Hello, World!', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('onAccept', { examples: ctx => [ctx.getCallback('onAccept')] })
    .prop('onCancel', { examples: ctx => [ctx.getCallback('onCancel')] })
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);
export = SearchInputDoc;