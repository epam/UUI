import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class RadioInputDoc extends BaseDocsBlock {
    title = 'RadioInput';

    override config: TDocConfig = {
        name: 'RadioInput',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RadioInputProps', component: uui.RadioInput },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:RadioInputProps',
                component: loveship.RadioInput,
                doc: (doc: DocBuilder<loveship.RadioInputProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:RadioInputProps',
                component: promo.RadioInput,
                doc: (doc: DocBuilder<uui.RadioInputProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
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
