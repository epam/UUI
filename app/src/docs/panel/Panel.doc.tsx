import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../../common';
import { TDocConfig } from '../../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from '../_props/loveship/docs';
import * as promoDocs from '../_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { childrenExamples } from './panelExamples';

export class PanelDoc extends BaseDocsBlock {
    title = 'Panel';

    override config: TDocConfig = {
        name: 'Panel',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:PanelProps', component: uui.Panel },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:PanelProps',
                component: loveship.Panel,
                doc: (doc: DocBuilder<loveship.PanelProps>) => doc.withContexts(loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:PanelProps',
                component: promo.Panel,
                doc: (doc: DocBuilder<promo.PanelProps>) => doc.withContexts(promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<promo.PanelProps | loveship.PanelProps | uui.PanelProps>) => {
            doc.merge('children', { examples: childrenExamples });
            doc.merge('shadow', { examples: [{ value: true, isDefault: true }] });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="panel-description" />
                {this.renderSectionTitle('Examples')}
                <DocExample path="./_examples/flexItems/Panel.example.tsx" />
            </>
        );
    }
}
