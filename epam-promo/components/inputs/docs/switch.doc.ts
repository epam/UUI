import { DocBuilder } from '@epam/uui-docs';
import { SwitchProps } from '@epam/uui-components';
import { Switch, SwitchMods } from '../Switch';
import { isDisabledDoc, isInvalidDoc, iHasLabelDoc, iEditable } from '../../../docs';
import { DefaultContext, FormContext } from '../../../docs';

const SwitchDoc = new DocBuilder<SwitchProps & SwitchMods>({ name: 'Switch', component: Switch as React.ComponentClass<any>})
    .implements([isDisabledDoc, isInvalidDoc, iEditable, iHasLabelDoc] as any)
    .prop('size', { examples: ['12', '18', '24'], defaultValue: '18' })
    .prop('value', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, FormContext);

export = SwitchDoc;