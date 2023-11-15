import * as React from 'react';
import { BaseDocsBlock, EditableDocContent, DocExample, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class CountIndicatorDoc extends BaseDocsBlock {
    title = 'CountIndicator';

    override config: TDocConfig = {
        name: 'CountIndicator',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:CountIndicatorProps', component: uui.CountIndicator },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:CountIndicatorProps',
                component: loveship.CountIndicator,
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:CountIndicatorProps',
                component: promo.CountIndicator,
            },
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
