import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { TextInputProps } from '@epam/uui-components';
import { SearchInput, TextInputMods } from '@epam/promo';
import {
    iEditable,
    sizeDoc,
    iHasPlaceholder,
    onClickDoc,
    isDisabledDoc,
    isInvalidDoc,
    iconDoc,
    iconOptionsDoc,
    dropdownTogglerDoc,
    DefaultContext,
    FormContext,
    ResizableContext,
    TableContext,
} from '../../docs';
import { IEditableDebouncerOptions } from '@epam/uui-core';

const SearchInputDoc = new DocBuilder<TextInputProps & TextInputMods & IEditableDebouncerOptions>({ name: 'SearchInput', component: SearchInput })
    .implements([
        onClickDoc,
        sizeDoc,
        isDisabledDoc,
        isReadonlyDoc,
        isInvalidDoc,
        iconDoc,
        iconOptionsDoc,
        iEditable,
        iHasPlaceholder,
        dropdownTogglerDoc,
    ])
    .prop('value', {
        examples: [
            { value: 'Hello, World!', isDefault: true },
            {
                name: 'long text',
                value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa',
            },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('onAccept', { examples: ctx => [ctx.getCallback('onAccept')] })
    .prop('onCancel', { examples: ctx => [ctx.getCallback('onCancel')] })
    .prop('mode', { examples: ['cell'] })
    .withContexts(DefaultContext, FormContext, ResizableContext, TableContext);
export default SearchInputDoc;
