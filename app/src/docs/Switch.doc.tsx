import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

export class SwitchDoc extends BaseDocsBlock {
    title = 'Switch';

    override config: TDocConfig = {
        name: 'Switch',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:SwitchProps', component: uui.Switch },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:SwitchProps', component: loveship.Switch },
            [TSkin.UUI4_promo]: { type: '@epam/uui:SwitchProps', component: promo.Switch },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="switch-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/switch/Basic.example.tsx" />
            </>
        );
    }
}
