import * as React from 'react';
import { LabeledInput, TextInput, Checkbox } from '@epam/uui';
import { DocBuilder } from '@epam/uui-docs';
import { LabeledInputProps } from '@epam/uui-components';
import {
    ResizableContext, DefaultContext, sizeDoc, isInvalidDoc, iHasLabelDoc,
} from '../../docs';
import { LabeledInputMods } from '@epam/uui';

const labeledInputDoc = new DocBuilder<LabeledInputProps & LabeledInputMods>({ name: 'LabeledInput', component: LabeledInput })
    .implements([
        isInvalidDoc, iHasLabelDoc, sizeDoc,
    ])
    .prop('labelPosition', { examples: [{ value: 'top', isDefault: true }, 'left'] })
    .prop('children', {
        examples: [
            { name: 'TextInput 48', value: <TextInput value="text" size="48" onValueChange={ null } /> }, { name: 'TextInput 36', value: <TextInput value="text" onValueChange={ null } />, isDefault: true }, { name: 'TextInput 30', value: <TextInput value="text" size="30" onValueChange={ null } /> }, { name: 'TextInput 24', value: <TextInput value="text" size="24" onValueChange={ null } /> }, { name: 'Checkbox', value: <Checkbox value={ true } onValueChange={ null } /> },
        ],
    })
    .prop('info', { examples: [{ value: 'This tooltip can be helpful' }] })
    .prop('isRequired', { examples: [true] })
    .prop('isOptional', { examples: [true] })
    .prop('validationMessage', { examples: [{ value: 'This field is mandatory.', isDefault: true }] })
    .prop('value', { examples: ['Some simple text'] })
    .prop('maxLength', { examples: [5, 10, 20] })
    .prop('charCounter', { examples: [true, false] })
    .prop('sidenote', { examples: ['This is a text in sideNote.'] })
    .prop('footnote', { examples: ['This is a text in footNote.'] })
    .withContexts(DefaultContext, ResizableContext);

export default labeledInputDoc;