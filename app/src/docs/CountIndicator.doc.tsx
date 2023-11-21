import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, EditableDocContent, DocExample } from '../common';

export class CountIndicatorDoc extends BaseDocsBlock {
    title = 'CountIndicator';

    override config: TDocConfig = {
        name: 'CountIndicator',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:CountIndicatorProps', component: uui.CountIndicator },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:CountIndicatorProps', component: loveship.CountIndicator },
            [TSkin.UUI4_promo]: { type: '@epam/promo:CountIndicatorProps', component: promo.CountIndicator },
        },
        doc: (doc: DocBuilder<uui.CountIndicatorProps | promo.CountIndicatorProps | loveship.CountIndicatorProps>) => {
            doc.setDefaultPropExample('color', (example) => example.value === 'neutral');
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="countIndicator-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/countIndicator/Basic.example.tsx" />
            </>
        );
    }
}
