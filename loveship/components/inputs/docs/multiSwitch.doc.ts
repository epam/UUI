import { MultiSwitch, MultiSwitchProps } from '../MultiSwitch';
import { DocBuilder } from '@epam/uui-docs';
import { FormContext, GridContext, DefaultContext } from '../../../docs';
import { sizeDoc, colorDoc, iEditable } from '../../../docs';

const multiSwitchDoc = new DocBuilder<MultiSwitchProps<{}>>({ name: 'MultiSwitch', component: MultiSwitch })
    .implements([sizeDoc, colorDoc, iEditable])
    .prop('items', { examples: [
        {
            name: 'Context Switch',
            value:
                [
                    { id: 1, caption: 'Form' },
                    { id: 2, caption: 'Default' },
                    { id: 3, caption: 'Resizable' },
                ],
            isDefault: true,
        },
        {
            name: 'Toggle Switch',
            value:
                [
                    { id: 1, caption: 'On' },
                    { id: 2, caption: 'Off' },
                ],
        },
    ], isRequired: true })
    .withContexts(DefaultContext, FormContext, GridContext);

export = multiSwitchDoc;
