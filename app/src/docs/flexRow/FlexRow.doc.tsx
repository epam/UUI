import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { flexRowChildren } from './flexRowExamples';

export class FlexRowDoc extends BaseDocsBlock {
    title = 'FlexRow';

    static override config: TDocConfig = {
        name: 'FlexRow',
        contexts: [TDocContext.Default, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:FlexRowProps', component: uui.FlexRow },
            [TSkin.Electric]: { type: '@epam/uui:FlexRowProps', component: electric.FlexRow },
            [TSkin.Loveship]: {
                type: '@epam/loveship:FlexRowProps',
                component: loveship.FlexRow,
                doc: (doc: DocBuilder<loveship.FlexRowProps>) => {
                    doc.merge('size', { defaultValue: '36' });
                },
            },
            [TSkin.Promo]: {
                type: '@epam/promo:FlexRowProps',
                component: promo.FlexRow,
                doc: (doc: DocBuilder<promo.FlexRowProps>) => {
                    doc.merge('size', { defaultValue: '36' });
                },
            },
        },
        doc: (doc: DocBuilder<uui.FlexRowProps | loveship.FlexRowProps | promo.FlexRowProps>) => {
            doc.merge('children', { examples: flexRowChildren });
            doc.merge('columnGap', { editorType: 'NumEditor', examples: [6, 12, 18, 24, 36] });
            doc.merge('rowGap', { editorType: 'NumEditor', examples: [6, 12, 18, 24, 36] });
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
