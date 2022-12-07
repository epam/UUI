import { DocBuilder } from '@epam/uui-docs';
import { SwitchProps } from '@epam/uui-components';
import { Switch, SwitchMods } from '../Switch';
import { isDisabledDoc, iHasLabelDoc, iEditable, colorDoc } from '../../../docs';
import { DefaultContext, ResizableContext, FormContext } from '../../../docs';

const SwitchDoc = new DocBuilder<SwitchProps & SwitchMods>({ name: 'Switch', component: Switch })
    .implements([isDisabledDoc, iHasLabelDoc, iEditable, colorDoc])
    .prop('theme', { examples: (['light', 'dark']), defaultValue: 'light' })
    .prop('size', { examples: ['12', '18', '24'], defaultValue: '18' })
    .prop('value', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default SwitchDoc;
