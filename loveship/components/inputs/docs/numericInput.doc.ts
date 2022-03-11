import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { NumericInputProps } from '@epam/uui-components';
import { NumericInput, NumericInputMods } from '../NumericInput';
import { iEditable, sizeDoc, textSettingsDoc, isDisabledDoc, iHasPlaceholder, modeDoc, iFormatter } from '../../../docs';
import { FormContext, GridContext, ResizableContext, DefaultContext } from '../../../docs';

const NumericInputDoc = new DocBuilder<NumericInputProps & NumericInputMods>({ name: 'NumericInput', component: NumericInput })
    .implements([iEditable, iHasPlaceholder, sizeDoc, textSettingsDoc, isDisabledDoc, isReadonlyDoc, modeDoc, iFormatter])
    .prop('value', { examples: [{ value: 0, isDefault: true }, 11] })
    .prop('step', { examples: [2, 5, 10] })
    .prop('min', { examples: [0, 10], isRequired: true })
    .prop('max', { examples: [20, 50], isRequired: true })
    .prop('mode', { examples: ["form", "cell"] })
    .prop('align', { examples: ["left", "right"] })
    .prop('disableArrows', { examples: [true, false] })
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);

export = NumericInputDoc;