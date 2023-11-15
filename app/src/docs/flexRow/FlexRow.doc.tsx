import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../../common';
import { TDocConfig } from '../../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from '../_props/loveship/docs';
import * as promoDocs from '../_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { getFlexRowExamples } from './flexRowExamples';

export class FlexRowDoc extends BaseDocsBlock {
    title = 'FlexRow';

    override config: TDocConfig = {
        name: 'FlexRow',
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:FlexRowProps',
                component: uui.FlexRow,
                doc: (doc: DocBuilder<uui.FlexRowProps>) => {
                    doc.merge('children', { examples: getFlexRowExamples(TSkin.UUI).children });
                },
            },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:FlexRowProps',
                component: loveship.FlexRow,
                doc: (doc: DocBuilder<loveship.FlexRowProps>) => {
                    doc.withContexts(loveshipDocs.ResizableContext);
                    doc.merge('children', { examples: getFlexRowExamples(TSkin.UUI3_loveship).children });
                    doc.merge('columnGap', { renderEditor: 'NumEditor', examples: [] });
                    doc.merge('rowGap', { renderEditor: 'NumEditor', examples: [] });
                    doc.merge('size', { defaultValue: '36' });
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:FlexRowProps',
                component: promo.FlexRow,
                doc: (doc: DocBuilder<promo.FlexRowProps>) => {
                    doc.withContexts(promoDocs.ResizableContext);
                    doc.merge('children', { examples: getFlexRowExamples(TSkin.UUI4_promo).children });
                    doc.merge('columnGap', { renderEditor: 'NumEditor', examples: [] });
                    doc.merge('rowGap', { renderEditor: 'NumEditor', examples: [] });
                    doc.merge('size', { defaultValue: '36' });
                },
            },
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
