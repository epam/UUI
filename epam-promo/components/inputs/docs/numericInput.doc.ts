import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { NumericInputProps } from '@epam/uui-components';
import { NumericInput, NumericInputMods } from '../NumericInput';
import { iEditable, sizeDoc, isDisabledDoc, iHasPlaceholder } from '../../../docs';
import { DefaultContext, FormContext, TableContext } from '../../../docs';

const handleFormatter = (val: number) => +val?.toFixed(2);

const NumericInputDoc = new DocBuilder<NumericInputProps & NumericInputMods>({ name: 'NumericInput', component: NumericInput })
    .implements([iEditable, iHasPlaceholder, sizeDoc, isDisabledDoc, isReadonlyDoc])
    .prop('value', { examples: [{ value: 0, isDefault: true }, 11] })
    .prop('step', { examples: [5, 10, 100] })
    .prop('min', { examples: [-10, 0, 10] })
    .prop('max', { examples: [20, 50, 500] })
    .prop('mode', { examples: ["form", "cell"] })
    .prop('align', { examples: ["left", "right"] })
    .prop('disableArrows', { examples: [true, false] })
    .prop('isInvalid', { examples: [true] })
    .prop('formatter', { examples: [{ value: handleFormatter, name: '(value) => { ... }', isDefault: false }], isRequired: false })
    .withContexts(DefaultContext, FormContext, TableContext);

export = NumericInputDoc;