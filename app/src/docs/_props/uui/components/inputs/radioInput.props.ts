import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { RadioInputProps } from '@epam/uui-components';
import { RadioInput, RadioInputMods } from '@epam/uui';
import {
    isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable,
} from '../../docs';
import { DefaultContext } from '../../docs';

const RadioInputDoc = new DocBuilder<RadioInputProps & RadioInputMods>({ name: 'RadioInput', component: RadioInput })
    .implements([
        isDisabledDoc,
        isReadonlyDoc,
        isInvalidDoc,
        iHasLabelDoc,
        iEditable,
    ] as any)
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'] })
    .withContexts(DefaultContext);

export default RadioInputDoc;
