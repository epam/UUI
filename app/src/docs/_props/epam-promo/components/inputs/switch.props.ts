import { DocBuilder } from '@epam/uui-docs';
import { SwitchProps } from '@epam/uui-components';
import { Switch } from '@epam/promo';
import { SwitchMods } from '@epam/uui';
import { isDisabledDoc, iHasLabelDoc, iEditable } from '../../docs';
import { DefaultContext, FormContext } from '../../docs';

const SwitchDoc = new DocBuilder<SwitchProps & SwitchMods>({ name: 'Switch', component: Switch })
    .implements([
        isDisabledDoc, iHasLabelDoc, iEditable,
    ])
    .prop('size', {
        examples: [
            '12', '18', '24',
        ],
        defaultValue: '18',
    })
    .prop('value', { examples: [true, false], defaultValue: false })
    .withContexts(DefaultContext, FormContext);

export default SwitchDoc;
