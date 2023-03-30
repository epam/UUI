import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { CheckboxProps } from '@epam/uui-components';
import { Checkbox, CheckboxMods } from '@epam/loveship';
import { isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable, DefaultContext, FormContext, TableContext } from '../../docs';

const CheckboxDoc = new DocBuilder<CheckboxProps & CheckboxMods>({ name: 'Checkbox', component: Checkbox })
    .implements([isDisabledDoc, isReadonlyDoc, isInvalidDoc, iHasLabelDoc, iEditable])
    .prop('value', { examples: [true, false] })
    .prop('size', { examples: ['12', '18'], defaultValue: '18' })
    .prop('theme', { examples: (['light', 'dark']), defaultValue: 'light' })
    .prop('indeterminate', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, FormContext, TableContext);

export default CheckboxDoc;
