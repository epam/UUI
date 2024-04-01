import React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class TabButtonDoc extends BaseDocsBlock {
    title = 'Tab Button';

    static override config: TDocConfig = {
        name: 'TabButton',
        contexts: [TDocContext.TabButton],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TabButtonProps', component: uui.TabButton },
            [TSkin.Electric]: { type: '@epam/uui:TabButtonProps', component: electric.TabButton },
            [TSkin.Loveship]: { type: '@epam/uui:TabButtonProps', component: loveship.TabButton },
            [TSkin.Promo]: { type: '@epam/uui:TabButtonProps', component: promo.TabButton },
        },
        doc: (doc: DocBuilder<uui.TabButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tab-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tabButton/Basic.example.tsx" />
            </>
        );
    }
}
