import { DocBuilder } from '@epam/uui-docs';
import { CheckboxGroupProps } from '@epam/uui-components';
import { CheckboxGroup } from '../CheckboxGroup';
import { isDisabledDoc, isInvalidDoc, iEditable } from '../../../docs';
import { FormContext, DefaultContext } from '../../../docs';

const checkboxGroupDoc = new DocBuilder<CheckboxGroupProps<any>>({ name: 'CheckboxGroup', component: CheckboxGroup })
    .implements([isDisabledDoc, isInvalidDoc, iEditable] as any)
    .prop('items', { examples: [
        {
            name: `Roles`,
            value: [
                { name: 'Mentee', id: 1 },
                { name: 'Direct Subordinates', id: 2 },
                { name: 'Project Members', id: 3 },
            ],
            isDefault: true,
        },
    ], isRequired: true })
    .prop('direction', { examples:['vertical', 'horizontal'], defaultValue: 'vertical' })
    .withContexts(DefaultContext, FormContext);

export = checkboxGroupDoc;