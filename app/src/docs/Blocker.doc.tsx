import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class BlockerDoc extends BaseDocsBlock {
    title = 'Blocker';

    static override config: TDocConfig = {
        name: 'Blocker',
        contexts: [TDocContext.RelativePanel],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:BlockerProps', component: uui.Blocker },
            [TSkin.Loveship]: { type: '@epam/uui-components:BlockerProps', component: loveship.Blocker },
            [TSkin.Promo]: { type: '@epam/uui-components:BlockerProps', component: promo.Blocker },
            [TSkin.Electric]: { type: '@epam/uui-components:BlockerProps', component: electric.Blocker },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="blocker-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/blocker/Basic.example.tsx" />

                <DocExample title="Advanced" path="./_examples/blocker/Advanced.example.tsx" />
            </>
        );
    }
}
