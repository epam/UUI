import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { NumericInputProps } from '@epam/uui-components';
import { NumericInput } from '@epam/loveship';
import { NumericInputMods } from '@epam/uui';
import { iEditable, sizeDoc, textSettingsDoc, isDisabledDoc, iHasPlaceholder, modeDoc, TableContext } from '../../docs';
import { FormContext, ResizableContext, DefaultContext } from '../../docs';

const NumericInputDoc = new DocBuilder<NumericInputProps & NumericInputMods>({ name: 'NumericInput', component: NumericInput })
    .implements([iEditable, iHasPlaceholder, sizeDoc, textSettingsDoc, isDisabledDoc, isReadonlyDoc, modeDoc])
    .prop('value', { examples: [{ value: 0, isDefault: true }, 11] })
    .prop('step', { examples: [2, 5, 10] })
    .prop('min', { examples: [0, 10], defaultValue: 0 })
    .prop('max', { examples: [20, 50] })
    .prop('mode', { examples: ['form', 'cell'] })
    .prop('align', { examples: ['left', 'right'] })
    .prop('disableArrows', { examples: [true, false] })
    .prop('disableLocaleFormatting', { defaultValue: false, examples: [true, false] })
    .withContexts(DefaultContext, FormContext, TableContext, ResizableContext);

export default NumericInputDoc;
