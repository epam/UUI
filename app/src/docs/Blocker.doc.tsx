import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class BlockerDoc extends BaseDocsBlock {
    title = 'Blocker';

    override config: TDocConfig = {
        name: 'Blocker',
        contexts: [TDocContext.RelativePanel],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:BlockerProps', component: uui.Blocker },
            [TSkin.UUI3_loveship]: { type: '@epam/uui-components:BlockerProps', component: loveship.Blocker },
            [TSkin.UUI4_promo]: { type: '@epam/uui-components:BlockerProps', component: promo.Blocker },
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
