import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

export class VerticalTabButtonDoc extends BaseDocsBlock {
    title = 'Vertical Tab Button';

    override config: TDocConfig = {
        name: 'VerticalTabButton',
        contexts: [TDocContext.VerticalTabButton],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:VerticalTabButtonProps', component: uui.VerticalTabButton },
            [TSkin.Loveship]: { type: '@epam/uui:VerticalTabButtonProps', component: loveship.VerticalTabButton },
            [TSkin.Promo]: { type: '@epam/uui:VerticalTabButtonProps', component: promo.VerticalTabButton },
        },
        doc: (doc: DocBuilder<uui.VerticalTabButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="vertical-tab-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/verticalTabButton/Basic.example.tsx" />
            </>
        );
    }
}
