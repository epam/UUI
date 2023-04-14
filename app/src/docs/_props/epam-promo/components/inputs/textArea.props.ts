import { DocBuilder } from '@epam/uui-docs';
import { TextAreaProps } from '@epam/uui';
import { TextArea } from '@epam/promo';
import { DefaultContext, FormContext, iEditable, IHasEditModeDoc, iHasPlaceholder,
    isDisabledDoc, isInvalidDoc, isReadonlyDoc, ResizableContext, sizeDoc, TableContext } from '../../docs';

const TextareaDoc = new DocBuilder<TextAreaProps>({ name: 'TextArea', component: TextArea })
    .implements([iEditable, sizeDoc, iHasPlaceholder, isDisabledDoc, isReadonlyDoc, isInvalidDoc, IHasEditModeDoc])
    .prop('value', { examples: [
            'Hello, World!',
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ], type: 'string' })
    .prop('rows', { examples: [1, 10, 20, 30] })
    .prop('maxLength', { examples: [30, 50, 120] })
    .prop('autoSize', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, FormContext, TableContext, ResizableContext);

export default TextareaDoc;
