import { DocBuilder } from '@epam/uui-docs';
import { SwitchProps } from '@epam/uui-components';
import { Switch, SwitchMods } from '@epam/uui';
import { isDisabledDoc, iHasLabelDoc, iEditable } from '../../docs';
import { DefaultContext } from '../../docs';

const SwitchDoc = new DocBuilder<SwitchProps & SwitchMods>({ name: 'Switch', component: Switch })
    .implements([isDisabledDoc, iHasLabelDoc, iEditable] as any)
    .prop('size', { examples: ['12', '18', '24'], defaultValue: '18' })
    .prop('value', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext);

export default SwitchDoc;
