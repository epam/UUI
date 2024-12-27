import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class StatusIndicatorDoc extends BaseDocsBlock {
    title = 'StatusIndicator';

    static override config: TDocConfig = {
        name: 'StatusIndicator',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:StatusIndicatorProps', component: uui.StatusIndicator },
            [TSkin.Loveship]: { type: '@epam/loveship:StatusIndicatorProps', component: loveship.StatusIndicator },
            [TSkin.Promo]: { type: '@epam/promo:StatusIndicatorProps', component: promo.StatusIndicator },
            [TSkin.Electric]: { type: '@epam/electric:StatusIndicatorProps', component: electric.StatusIndicator },
        },
    };

    renderContent() {
        return (
            <>
                {this.renderSectionTitle('Examples')}
                <EditableDocContent fileName="statusIndicator-descriptions" />
                <DocExample config={ this.getConfig() } title="Sizes example" path="./_examples/statusIndicator/Sizes.example.tsx" />
                <DocExample config={ this.getConfig() } title="Fill & Colors example" path="./_examples/statusIndicator/Basic.example.tsx" />
                <DocExample title="Uses in Table example" path="./_examples/statusIndicator/WithTable.example.tsx" />
                <DocExample title="Dropdown example" path="./_examples/statusIndicator/Dropdown.example.tsx" />
            </>
        );
    }
}
