import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class RadioGroupDoc extends BaseDocsBlock {
    title = 'RadioGroup';

    static override config: TDocConfig = {
        name: 'RadioGroup',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RadioGroupProps', component: uui.RadioGroup },
            [TSkin.Electric]: { type: '@epam/uui:RadioGroupProps', component: electric.RadioGroup },
            [TSkin.Loveship]: { type: '@epam/uui:RadioGroupProps', component: loveship.RadioGroup },
            [TSkin.Promo]: { type: '@epam/uui:RadioGroupProps', component: promo.RadioGroup },
        },
        doc: (doc: DocBuilder<uui.RadioGroupProps<any>>) => {
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
            doc.merge('value', { examples: [1, 2, 3] });
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
