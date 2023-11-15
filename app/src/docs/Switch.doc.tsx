import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class SwitchDoc extends BaseDocsBlock {
    title = 'Switch';

    override config: TDocConfig = {
        name: 'Switch',
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:SwitchProps',
                component: uui.Switch,
            },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:SwitchProps',
                component: loveship.Switch,
                doc: (doc: DocBuilder<uui.SwitchProps>) => doc.withContexts(loveshipDocs.ResizableContext, loveshipDocs.FormContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:SwitchProps',
                component: promo.Switch,
                doc: (doc: DocBuilder<uui.SwitchProps>) => doc.withContexts(promoDocs.ResizableContext, promoDocs.FormContext),
            },
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
