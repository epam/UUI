import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class StatusIndicatorDoc extends BaseDocsBlock {
    title = 'StatusIndicator';

    override config: TDocConfig = {
        name: 'StatusIndicator',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:StatusIndicatorProps', component: uui.StatusIndicator },
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:StatusIndicatorProps', component: loveship.StatusIndicator },
            [TSkin.UUI4_promo]: { type: '@epam/promo:StatusIndicatorProps', component: promo.StatusIndicator },
        },
    };

    renderContent() {
        return (
            <>
                {this.renderSectionTitle('Examples')}
                <EditableDocContent fileName="statusIndicator-descriptions" />
                <DocExample title="Sizes example" path="./_examples/statusIndicator/Sizes.example.tsx" />
                <DocExample title="Fill & Colors example" path="./_examples/statusIndicator/Basic.example.tsx" />
                <DocExample title="Uses in Table example" path="./_examples/statusIndicator/WithTable.example.tsx" />
                <DocExample title="Dropdown example" path="./_examples/statusIndicator/Dropdown.example.tsx" />
            </>
        );
    }
}
