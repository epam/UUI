import { DocBuilder } from '@epam/uui-docs';
import { TextAreaProps } from '@epam/uui-components';
import { TextArea, TextAreaMods } from '../TextArea';
import { iEditable, textSettingsDoc, isDisabledDoc, isReadonlyDoc, iHasPlaceholder, isInvalidDoc, modeDoc } from '../../../docs';
import { ResizableContext, DefaultContext, FormContext, GridContext } from '../../../docs';

const TextareaDoc = new DocBuilder<TextAreaProps & TextAreaMods>({ name: 'TextArea', component: TextArea })
    .implements([iEditable, textSettingsDoc, iHasPlaceholder, isDisabledDoc, isReadonlyDoc, isInvalidDoc, modeDoc] as any)
    .prop('value', { examples: [
        'Hello, World!',
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('size', { examples: ['24', '30', '36', '42', '48'] , defaultValue: '36' })
    .prop('rows', { examples: [1, 10, 20, 30] })
    .prop('maxLength', { examples: [30, 50, 120] })
    .prop('autoSize', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, ResizableContext, FormContext, GridContext);

export = TextareaDoc;