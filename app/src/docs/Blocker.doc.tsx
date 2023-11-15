import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import { DocBuilder } from '@epam/uui-docs';
import * as uuiComponents from '@epam/uui-components';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uuiDocs from './_props/uui/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as loveshipDocs from './_props/loveship/docs';
import { TDocConfig } from '../common/docs/docBuilderGen/types';

export class BlockerDoc extends BaseDocsBlock {
    title = 'Blocker';

    override config: TDocConfig = {
        name: 'Blocker',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:BlockerProps',
                component: uui.Blocker,
                doc: (doc: DocBuilder<uuiComponents.BlockerProps>) => doc.withContextsReplace(uuiDocs.RelativePanelContext) },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui-components:BlockerProps',
                component: loveship.Blocker,
                doc: (doc: DocBuilder<uuiComponents.BlockerProps>) => doc.withContextsReplace(loveshipDocs.RelativePanelContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui-components:BlockerProps',
                component: promo.Blocker,
                doc: (doc: DocBuilder<uuiComponents.BlockerProps>) => doc.withContextsReplace(promoDocs.RelativePanelContext),
            },
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
