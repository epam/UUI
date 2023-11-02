import { DocBuilder } from '@epam/uui-docs';
import { CheckboxProps } from '@epam/uui-components';
import { Checkbox } from '@epam/promo';
import { CheckboxMods } from '@epam/uui';
import {
    isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable, DefaultContext, FormContext, TableContext,
} from '../../docs';

const CheckboxDoc = new DocBuilder<CheckboxProps & CheckboxMods>({ name: 'Checkbox', component: Checkbox })
    .implements([
        isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable,
    ])
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'], defaultValue: '18' })
    .prop('indeterminate', { examples: [true, false], defaultValue: false })
    .prop('isReadonly', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, FormContext, TableContext);

export default CheckboxDoc;
