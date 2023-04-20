import { DocBuilder } from '@epam/uui-docs';
import { RadioGroupProps } from '@epam/uui-components';
import { RadioGroup } from '@epam/loveship';
import { isDisabledDoc, isInvalidDoc, iEditable } from '../../docs';
import { FormContext, DefaultContext, ResizableContext } from '../../docs';

const radioGroupDoc = new DocBuilder<RadioGroupProps<any>>({ name: 'RadioGroup', component: RadioGroup })
    .implements([isDisabledDoc, isInvalidDoc, iEditable])
    .prop('items', {
        examples: [
            {
                name: `Languages`,
                value: [
                    { name: 'English', id: 1 },
                    { name: 'Russian', id: 2 },
                    { name: 'German', id: 3 },
                ],
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('direction', { examples: ['vertical', 'horizontal'], defaultValue: 'vertical' })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default radioGroupDoc;
