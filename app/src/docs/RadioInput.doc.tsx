import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class RadioInputDoc extends BaseDocsBlock {
    title = 'RadioInput';

    static override config: TDocConfig = {
        name: 'RadioInput',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RadioInputProps', component: uui.RadioInput },
            [TSkin.Electric]: { type: '@epam/uui:RadioInputProps', component: electric.RadioInput },
            [TSkin.Loveship]: { type: '@epam/uui:RadioInputProps', component: loveship.RadioInput },
            [TSkin.Promo]: { type: '@epam/uui:RadioInputProps', component: promo.RadioInput },
        },
        doc: (doc: DocBuilder<uui.RadioInputProps>) => {
            doc.merge('value', { examples: [true, { value: false, isDefault: true }] });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="radioInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/radioInput/Basic.example.tsx" />
                <DocExample title="RadioInput Group" path="./_examples/radioInput/Group.example.tsx" />
            </>
        );
    }
}
