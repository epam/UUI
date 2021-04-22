import { DocBuilder } from '@epam/uui-docs';
import { TextAreaProps } from '@epam/uui-components';
import { TextArea, TextAreaMods } from '../TextArea';
import { iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, iHasPlaceholder, isInvalidDoc } from '../../../docs';
import { DefaultContext, FormContext, TableContext } from '../../../docs';

const TextareaDoc = new DocBuilder<TextAreaProps & TextAreaMods>({ name: 'TextArea', component: TextArea })
    .implements([iEditable, sizeDoc, iHasPlaceholder, isDisabledDoc, isReadonlyDoc, isInvalidDoc] as any)
    .prop('value', { examples: [
            'Hello, World!',
            { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
            { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        ], type: 'string' })
    .prop('rows', { examples: [1, 10, 20, 30] })
    .prop('maxLength', { examples: [30, 50, 120] })
    .prop('autoSize', { examples: [true, false], defaultValue: false })
    .prop('mode', { examples: ['cell'] })
    .withContexts(DefaultContext, FormContext, TableContext);

export = TextareaDoc;