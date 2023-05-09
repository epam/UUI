import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { RadioInputProps } from '@epam/uui-components';
import { RadioInput } from '@epam/promo';
import { RadioInputMods } from '@epam/uui';
import {
    isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable,
} from '../../docs';
import { DefaultContext, FormContext } from '../../docs';

const RadioInputDoc = new DocBuilder<RadioInputProps & RadioInputMods>({ name: 'RadioInput', component: RadioInput })
    .implements([
        isDisabledDoc, isReadonlyDoc, isInvalidDoc, iHasLabelDoc, iEditable,
    ])
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'] })
    .withContexts(DefaultContext, FormContext);

export default RadioInputDoc;
