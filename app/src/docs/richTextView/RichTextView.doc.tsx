import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../../common';
import { TDocConfig } from '../../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from '../_props/loveship/docs';
import * as promoDocs from '../_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { getRichTextViewExamples } from './richTextViewExamples';

export class RichTextViewDoc extends BaseDocsBlock {
    title = 'RichTextView';

    override config: TDocConfig = {
        name: 'RichTextView',
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:RichTextViewProps',
                component: uui.RichTextView,
                doc: (doc: DocBuilder<uui.RichTextViewProps>) => {
                    const examples = getRichTextViewExamples(TSkin.UUI);
                    doc.merge('htmlContent', { examples: examples.htmlContent });
                    doc.merge('children', { examples: examples.children });
                },
            },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:RichTextViewProps',
                component: loveship.RichTextView,
                doc: (doc: DocBuilder<uui.RichTextViewProps>) => {
                    doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext);
                    const examples = getRichTextViewExamples(TSkin.UUI3_loveship);
                    doc.merge('htmlContent', { examples: examples.htmlContent });
                    doc.merge('children', { examples: examples.children });
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:RichTextViewProps',
                component: promo.RichTextView,
                doc: (doc: DocBuilder<uui.RichTextViewProps>) => {
                    doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext);
                    const examples = getRichTextViewExamples(TSkin.UUI4_promo);
                    doc.merge('htmlContent', { examples: examples.htmlContent });
                    doc.merge('children', { examples: examples.children });
                },
            },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="richTextView-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/richTextView/Basic.example.tsx" />
            </>
        );
    }
}
