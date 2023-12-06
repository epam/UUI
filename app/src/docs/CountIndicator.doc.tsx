import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, EditableDocContent, DocExample } from '../common';

export class CountIndicatorDoc extends BaseDocsBlock {
    title = 'CountIndicator';

    override config: TDocConfig = {
        name: 'CountIndicator',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:CountIndicatorProps', component: uui.CountIndicator },
            [TSkin.Loveship]: { type: '@epam/loveship:CountIndicatorProps', component: loveship.CountIndicator },
            [TSkin.Promo]: { type: '@epam/promo:CountIndicatorProps', component: promo.CountIndicator },
            [TSkin.Electric]: { type: '@epam/uui:CountIndicatorProps', component: electric.CountIndicator },
        },
        doc: (doc: DocBuilder<uui.CountIndicatorProps | promo.CountIndicatorProps | loveship.CountIndicatorProps>) => {
            doc.setDefaultPropExample('color', (_, index) => index === 0);
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
