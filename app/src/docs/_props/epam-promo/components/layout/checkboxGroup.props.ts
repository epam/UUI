import { DocBuilder } from '@epam/uui-docs';
import { CheckboxGroupProps } from '@epam/uui-components';
import { CheckboxGroup } from '@epam/promo';
import {
    isDisabledDoc, isInvalidDoc, iEditable, FormContext, DefaultContext, ResizableContext,
} from '../../docs';

const checkboxGroupDoc = new DocBuilder<CheckboxGroupProps<any>>({ name: 'CheckboxGroup', component: CheckboxGroup })
    .implements([
        isDisabledDoc,
        isInvalidDoc,
        iEditable,
    ])
    .prop('items', {
        examples: [
            {
                name: 'Roles',
                value: [
                    { name: 'Mentee', id: 1 },
                    { name: 'Direct Subordinates', id: 2 },
                    { name: 'Project Members', id: 3 },
                ],
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('direction', { examples: ['vertical', 'horizontal'], defaultValue: 'vertical' })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default checkboxGroupDoc;
