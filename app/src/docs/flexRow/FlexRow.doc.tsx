import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { flexRowChildren } from './flexRowExamples';

export class FlexRowDoc extends BaseDocsBlock {
    title = 'FlexRow';

    override config: TDocConfig = {
        name: 'FlexRow',
        contexts: [TDocContext.Default, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:FlexRowProps', component: uui.FlexRow },
            [TSkin.Loveship]: {
                type: '@epam/loveship:FlexRowProps',
                component: loveship.FlexRow,
                doc: (doc: DocBuilder<loveship.FlexRowProps>) => {
                    doc.merge('columnGap', { editorType: 'NumEditor', examples: [] });
                    doc.merge('rowGap', { editorType: 'NumEditor', examples: [] });
                    doc.merge('size', { defaultValue: '36' });
                },
            },
            [TSkin.Promo]: {
                type: '@epam/promo:FlexRowProps',
                component: promo.FlexRow,
                doc: (doc: DocBuilder<promo.FlexRowProps>) => {
                    doc.merge('columnGap', { editorType: 'NumEditor', examples: [] });
                    doc.merge('rowGap', { editorType: 'NumEditor', examples: [] });
                    doc.merge('size', { defaultValue: '36' });
                },
            },
        },
        doc: (doc: DocBuilder<uui.FlexRowProps | loveship.FlexRowProps | promo.FlexRowProps>) => {
            doc.merge('children', { examples: flexRowChildren });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="flexRow-description" />
                {this.renderSectionTitle('Examples')}
                <DocExample path="./_examples/common/Card.example.tsx" />
            </>
        );
    }
}
