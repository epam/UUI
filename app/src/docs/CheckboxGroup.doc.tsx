import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import * as uuiComponents from '@epam/uui-components';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';

export class CheckboxGroupDoc extends BaseDocsBlock {
    title = 'CheckboxGroup';

    override config: TDocConfig = {
        name: 'CheckboxGroup',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:CheckboxGroupProps', component: uui.CheckboxGroup },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui-components:CheckboxGroupProps',
                component: loveship.CheckboxGroup,
                doc: (doc: DocBuilder<uuiComponents.CheckboxGroupProps<any>>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui-components:CheckboxGroupProps',
                component: promo.CheckboxGroup,
                doc: (doc: DocBuilder<uuiComponents.CheckboxGroupProps<any>>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<uuiComponents.CheckboxGroupProps<any>>) => {
            const itemsExample = [{ name: 'Mentee', id: 1 }, { name: 'Direct Subordinates', id: 2 }, { name: 'Project Members', id: 3 }];
            doc.merge('value', {
                renderEditor: 'JsonView',
                examples: [],
            });
            doc.merge('items', {
                examples: [
                    {
                        name: JSON.stringify(itemsExample, undefined, 1),
                        value: itemsExample,
                        isDefault: true,
                    },
                ],
            });
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
