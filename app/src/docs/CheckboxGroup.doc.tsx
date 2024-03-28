import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class CheckboxGroupDoc extends BaseDocsBlock {
    title = 'CheckboxGroup';

    static override config: TDocConfig = {
        name: 'CheckboxGroup',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:CheckboxGroupProps', component: uui.CheckboxGroup },
            [TSkin.Loveship]: { type: '@epam/uui:CheckboxGroupProps', component: loveship.CheckboxGroup },
            [TSkin.Promo]: { type: '@epam/uui:CheckboxGroupProps', component: promo.CheckboxGroup },
            [TSkin.Electric]: { type: '@epam/uui:CheckboxGroupProps', component: electric.CheckboxGroup },
        },
        doc: (doc: DocBuilder<uui.CheckboxGroupProps<any>>) => {
            doc.merge('value', { editorType: 'JsonView', examples: [] });
            const itemsExample = [{ name: 'Mentee', id: 1 }, { name: 'Direct Subordinates', id: 2 }, { name: 'Project Members', id: 3 }];
            doc.merge('items', { examples: [{ name: JSON.stringify(itemsExample, undefined, 1), value: itemsExample, isDefault: true }] });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="checkboxGroup-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Checkbox Group" path="./_examples/checkbox/Group.example.tsx" />
            </>
        );
    }
}
