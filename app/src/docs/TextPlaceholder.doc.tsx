import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class TextPlaceholderDoc extends BaseDocsBlock {
    title = 'TextPlaceholder';

    override config: TDocConfig = {
        name: 'TextPlaceholder',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TextPlaceholderProps', component: uui.TextPlaceholder },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:TextPlaceholderProps',
                component: loveship.TextPlaceholder,
                doc: (doc: DocBuilder<uui.TextPlaceholderProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:TextPlaceholderProps',
                component: promo.TextPlaceholder,
                doc: (doc: DocBuilder<uui.TextPlaceholderProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textPlaceholder-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textPlaceholder/Basic.example.tsx" />
            </>
        );
    }
}
