import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { RadioInputProps } from '@epam/uui-components';
import { RadioInput, RadioInputMods } from '../RadioInput';
import { isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable } from '../../../docs';
import { DefaultContext, ResizableContext, FormContext, colorDoc } from '../../../docs';

const RadioInputDoc = new DocBuilder<RadioInputProps & RadioInputMods>({ name: 'RadioInput', component: RadioInput })
    .implements([isDisabledDoc, isReadonlyDoc, colorDoc, isInvalidDoc, iHasLabelDoc, iEditable])
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'] })
    .prop('theme', { examples: (['light', 'dark']), defaultValue: 'light' })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default RadioInputDoc;
