import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { SearchInput, TextInputProps } from '@epam/uui';
import { iEditable, sizeDoc, iHasPlaceholder, onClickDoc, isDisabledDoc, isInvalidDoc, iconDoc, iconOptionsDoc, dropdownTogglerDoc, DefaultContext, ResizableContext } from '../../docs';
import { IEditableDebouncerOptions } from '@epam/uui-core';

const SearchInputDoc = new DocBuilder<TextInputProps & IEditableDebouncerOptions>({ name: 'SearchInput', component: SearchInput })
    .implements([
        onClickDoc, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, iconDoc, iconOptionsDoc, iEditable, iHasPlaceholder, dropdownTogglerDoc,
    ])
    .prop('value', {
        examples: [
            { value: 'Hello, World!', isDefault: true }, { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' }, { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('onAccept', { examples: (ctx) => [ctx.getCallback('onAccept')] })
    .prop('onCancel', { examples: (ctx) => [ctx.getCallback('onCancel')] })
    .prop('mode', { examples: ['cell'] })
    .withContexts(DefaultContext, ResizableContext);
export default SearchInputDoc;
