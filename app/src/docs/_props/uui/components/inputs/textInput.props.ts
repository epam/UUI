import { DocBuilder, PropSamplesCreationContext } from '@epam/uui-docs';
import { TextInputProps } from '@epam/uui-components';
import { TextInput, TextInputMods } from '@epam/uui';
import {
    iEditable, iHasPlaceholder, onClickDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, iconOptionsDoc, dropdownTogglerDoc,
} from '../../docs';
import { DefaultContext, IHasEditModeDoc } from '../../docs';

const TextInputDoc = new DocBuilder<TextInputProps & TextInputMods>({ name: 'TextInput', component: TextInput })
    .prop('size', {
        examples: [
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
        isDisabledDoc,
        isReadonlyDoc,
        isInvalidDoc,
        iconOptionsDoc,
        iEditable,
        iHasPlaceholder,
        dropdownTogglerDoc,
        IHasEditModeDoc,
    ] as any)
    .prop('maxLength', {
        examples: [
            10,
            20,
            30,
        ],
        type: 'number',
    })
    .prop('value', {
        examples: [
            { value: 'Hello, World!', isDefault: true },
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ],
        type: 'string',
    })
    .prop('onAccept', { examples: (ctx: PropSamplesCreationContext) => [ctx.getCallback('onAccept')] })
    .prop('onCancel', { examples: (ctx: PropSamplesCreationContext) => [ctx.getCallback('onCancel')] })
    .prop('type', { examples: ['text', 'password'], type: 'string', defaultValue: 'text' })
    .withContexts(DefaultContext);

export default TextInputDoc;
