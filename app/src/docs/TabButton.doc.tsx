import React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class TabButtonDoc extends BaseDocsBlock {
    title = 'Tab Button';

    override config: TDocConfig = {
        name: 'TabButton',
        contexts: [TDocContext.TabButton],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TabButtonProps', component: uui.TabButton },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:TabButtonProps', component: loveship.TabButton },
            [TSkin.UUI4_promo]: { type: '@epam/uui:TabButtonProps', component: promo.TabButton },
        },
        doc: (doc: DocBuilder<uui.TabButtonProps | loveship.TabButtonProps>) => {
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
