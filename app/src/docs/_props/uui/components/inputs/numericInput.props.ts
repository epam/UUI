import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { NumericInputProps } from '@epam/uui-components';
import { NumericInput, NumericInputMods } from '@epam/uui';
import { DefaultContext, iEditable, isDisabledDoc, sizeDoc, IHasEditModeDoc } from '../../docs';

const NumericInputDoc = new DocBuilder<NumericInputProps & NumericInputMods>({ name: 'NumericInput', component: NumericInput })
    .implements([
        iEditable,
        sizeDoc,
        isDisabledDoc,
        isReadonlyDoc,
        IHasEditModeDoc,
    ])
    .prop('value', { examples: [{ value: 0, isDefault: true }, 111] })
    .prop('step', {
        examples: [
            5, 10, 100,
        ],
    })
    .prop('min', {
        examples: [
            -10, 0, 10,
        ],
        defaultValue: 0,
    })
    .prop('max', {
        examples: [
            20, 50, 500,
        ],
    })
    .prop('align', { examples: ['left', 'right'] })
    .prop('disableArrows', { examples: [true, false] })
    .prop('disableLocaleFormatting', { defaultValue: false, examples: [true, false] })
    .withContexts(DefaultContext);

export default NumericInputDoc;
