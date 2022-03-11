import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { NumericInputProps } from '@epam/uui-components';
import { NumericInput, NumericInputMods } from '../NumericInput';
import { iEditable, sizeDoc, isDisabledDoc, iHasPlaceholder, iFormatter } from '../../../docs';
import { DefaultContext, FormContext } from '../../../docs';

const NumericInputDoc = new DocBuilder<NumericInputProps & NumericInputMods>({ name: 'NumericInput', component: NumericInput })
    .implements([iEditable, iHasPlaceholder, sizeDoc, isDisabledDoc, isReadonlyDoc, iFormatter])
    .prop('value', { examples: [{ value: 0, isDefault: true }, 111] })
    .prop('step', { examples: [5, 10, 100] })
    .prop('min', { examples: [-10, 0, 10], isRequired: true })
    .prop('max', { examples: [20, 50, 500], isRequired: true })
    .prop('mode', { examples: ["form", "cell"] })
    .prop('align', { examples: ["left", "right"] })
    .prop('disableArrows', { examples: [true, false] })
    .withContexts(DefaultContext, FormContext);

export = NumericInputDoc;