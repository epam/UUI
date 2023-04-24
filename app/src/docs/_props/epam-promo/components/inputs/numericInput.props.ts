import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { NumericInputProps } from '@epam/uui-components';
import { NumericInput } from '@epam/promo';
import { NumericInputMods } from '@epam/uui';
import {
    DefaultContext, FormContext, iEditable, iHasPlaceholder, isDisabledDoc, sizeDoc, TableContext,
} from '../../docs';

const NumericInputDoc = new DocBuilder<NumericInputProps & NumericInputMods>({ name: 'NumericInput', component: NumericInput })
    .implements([
        iEditable, iHasPlaceholder, sizeDoc, isDisabledDoc, isReadonlyDoc,
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
    .prop('mode', { examples: ['form', 'cell'] })
    .prop('align', { examples: ['left', 'right'] })
    .prop('disableArrows', { examples: [true, false] })
    .prop('disableLocaleFormatting', { defaultValue: false, examples: [true, false] })
    .withContexts(DefaultContext, FormContext, TableContext);

export default NumericInputDoc;
