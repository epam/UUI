import * as React from 'react';
import { BaseDocsBlock, EditableDocContent, DocExample, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import { DocBuilder } from '@epam/uui-docs';
import * as promo from '@epam/promo';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';

export class StatusIndicatorDoc extends BaseDocsBlock {
    title = 'StatusIndicator';

    override config: TDocConfig = {
        name: 'StatusIndicator',
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:StatusIndicatorProps',
                component: uui.StatusIndicator,
            },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:StatusIndicatorProps',
                component: loveship.StatusIndicator,
                doc: (doc: DocBuilder<loveship.StatusIndicatorProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:StatusIndicatorProps',
                component: promo.StatusIndicator,
                doc: (doc: DocBuilder<promo.StatusIndicatorProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
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
