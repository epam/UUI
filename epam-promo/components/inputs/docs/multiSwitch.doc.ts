import { MultiSwitch, MultiSwitchProps } from '../MultiSwitch';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext, FormContext } from '../../../docs';
import { sizeDoc, iEditable, isDisabledDoc } from '../../../docs';

const multiSwitchDoc = new DocBuilder<MultiSwitchProps<any>>({ name: 'MultiSwitch', component: MultiSwitch as React.ComponentClass<any> })
    .implements([sizeDoc, iEditable, isDisabledDoc] as any)
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
    ] })
    .withContexts(DefaultContext, FormContext);

export = multiSwitchDoc;
