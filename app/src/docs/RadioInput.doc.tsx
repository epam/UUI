import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class RadioInputDoc extends BaseDocsBlock {
    title = 'RadioInput';

    override config: TDocConfig = {
        name: 'RadioInput',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RadioInputProps', component: uui.RadioInput },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:RadioInputProps', component: loveship.RadioInput },
            [TSkin.UUI4_promo]: { type: '@epam/uui:RadioInputProps', component: promo.RadioInput },
        },
        doc: (doc: DocBuilder<loveship.RadioInputProps| uui.RadioInputProps>) => {
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
