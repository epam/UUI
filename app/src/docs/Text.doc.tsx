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

export class TextDoc extends BaseDocsBlock {
    title = 'Text';

    override config: TDocConfig = {
        name: 'Text',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TextProps', component: uui.Text },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:TextProps',
                component: loveship.Text,
                doc: (doc: DocBuilder<loveship.TextProps>) => {
                    doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext);
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:TextProps',
                component: promo.Text,
                doc: (doc: DocBuilder<promo.TextProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<promo.TextProps | loveship.TextProps | uui.TextProps>) => {
            doc.merge('children', {
                examples: [
                    { value: 'Hello World', isDefault: true }, {
                        value: 'At EPAM, we believe that technology defines business success, and we relentlessly pursue the best solution for every client to solve where others fail.',
                        name: 'long text',
                    },
                ],
                type: 'string',
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="text-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/text/Basic.example.tsx" />
            </>
        );
    }
}
