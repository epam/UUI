import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { htmlContent, children } from './richTextViewExamples';

export class RichTextViewDoc extends BaseDocsBlock {
    title = 'RichTextView';

    override config: TDocConfig = {
        name: 'RichTextView',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RichTextViewProps', component: uui.RichTextView },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:RichTextViewProps', component: loveship.RichTextView },
            [TSkin.UUI4_promo]: { type: '@epam/uui:RichTextViewProps', component: promo.RichTextView },
        },
        doc: (doc: DocBuilder<uui.RichTextViewProps>) => {
            doc.merge('htmlContent', { examples: htmlContent });
            doc.merge('children', { examples: children });
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
