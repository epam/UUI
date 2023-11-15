import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as uuiComponents from '@epam/uui-components';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class RadioGroupDoc extends BaseDocsBlock {
    title = 'RadioGroup';

    override config: TDocConfig = {
        name: 'RadioGroup',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:RadioGroupProps', component: uui.RadioGroup },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui-components:RadioGroupProps',
                component: loveship.RadioGroup,
                doc: (doc: DocBuilder<uuiComponents.RadioGroupProps<any>>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui-components:RadioGroupProps',
                component: promo.RadioGroup,
                doc: (doc: DocBuilder<uuiComponents.RadioGroupProps<any>>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<uuiComponents.RadioGroupProps<any>>) => {
            doc.merge('items', {
                examples: [
                    {
                        name: 'Languages',
                        value: [{ name: 'English', id: 1 }, { name: 'Russian', id: 2 }, { name: 'German', id: 3 }],
                        isDefault: true,
                    },
                ],
            });
            doc.merge('direction', { defaultValue: 'vertical' });
            doc.merge('value', { renderEditor: 'JsonView' });
            doc.merge('radioInputProps', { renderEditor: 'JsonEditor' });
            doc.merge('RadioInput', { examples: [{ value: uui.RadioInput, name: 'RadioInput', isDefault: true }], isRequired: true });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="radioGroup-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="RadioInput Group" path="./_examples/radioInput/Group.example.tsx" />
            </>
        );
    }
}
