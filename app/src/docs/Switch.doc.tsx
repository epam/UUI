import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

export class SwitchDoc extends BaseDocsBlock {
    title = 'Switch';

    static override config: TDocConfig = {
        name: 'Switch',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:SwitchProps', component: uui.Switch },
            [TSkin.Electric]: { type: '@epam/uui:SwitchProps', component: electric.Switch },
            [TSkin.Loveship]: { type: '@epam/uui:SwitchProps', component: loveship.Switch },
            [TSkin.Promo]: { type: '@epam/uui:SwitchProps', component: promo.Switch },
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
