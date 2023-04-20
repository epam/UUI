import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { RadioInputProps } from '@epam/uui';
import { RadioInput, RadioInputMods } from '@epam/loveship';
import { isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable } from '../../docs';
import { DefaultContext, ResizableContext, FormContext } from '../../docs';

const RadioInputDoc = new DocBuilder<RadioInputProps & RadioInputMods>({ name: 'RadioInput', component: RadioInput })
    .implements([isDisabledDoc, isReadonlyDoc, isInvalidDoc, iHasLabelDoc, iEditable])
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'] })
    .prop('theme', { examples: ['light', 'dark'], defaultValue: 'light' })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default RadioInputDoc;
