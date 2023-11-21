import * as React from 'react';
import * as uui from '@epam/uui';
import * as uuiComponents from '@epam/uui-components';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class RadioGroupDoc extends BaseDocsBlock {
    title = 'RadioGroup';

    override config: TDocConfig = {
        name: 'RadioGroup',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:RadioGroupProps', component: uui.RadioGroup },
            [TSkin.UUI3_loveship]: { type: '@epam/uui-components:RadioGroupProps', component: loveship.RadioGroup },
            [TSkin.UUI4_promo]: { type: '@epam/uui-components:RadioGroupProps', component: promo.RadioGroup },
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
            doc.merge('value', { editorType: 'JsonView' });
            doc.merge('radioInputProps', { editorType: 'JsonEditor' });
            doc.merge('RadioInput', { examples: [{ value: uui.RadioInput, name: 'RadioInput' }] });
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
