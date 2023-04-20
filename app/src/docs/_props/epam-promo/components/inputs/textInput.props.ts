import { DocBuilder } from '@epam/uui-docs';
import { TextInput, TextInputProps } from '@epam/promo';
import {
    DefaultContext,
    dropdownTogglerDoc,
    FormContext,
    iconDoc,
    iconOptionsDoc,
    iEditable,
    IHasEditModeDoc,
    iHasPlaceholder,
    isDisabledDoc,
    isInvalidDoc,
    isReadonlyDoc,
    onClickDoc,
    ResizableContext,
    TableContext,
} from '../../docs';
const TextInputDoc = new DocBuilder<TextInputProps>({ name: 'TextInput', component: TextInput })
    .prop('size', { examples: ['24', '30', '36', '42', '48'], defaultValue: '36' })
    .implements([onClickDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, iconDoc, iconOptionsDoc, iEditable, iHasPlaceholder, dropdownTogglerDoc, IHasEditModeDoc])
    .prop('maxLength', { examples: [10, 20, 30], type: 'number' })
    .prop('suffix', { examples: [{ value: 'Suffix' }], type: 'string' })
    .prop('prefix', { examples: [{ value: 'Prefix: ' }], type: 'string' })
    .prop('value', {
        examples: [
            { value: 'Hello, World!', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('onAccept', { examples: (ctx) => [ctx.getCallback('onAccept')] })
    .prop('onCancel', { examples: (ctx) => [ctx.getCallback('onCancel')] })
    .prop('type', { examples: ['text', 'password'], type: 'string', defaultValue: 'text' })
    .withContexts(DefaultContext, ResizableContext, FormContext, TableContext);

export default TextInputDoc;
