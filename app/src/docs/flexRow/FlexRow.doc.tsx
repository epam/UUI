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
            [TSkin.Loveship]: { type: '@epam/loveship:FlexRowProps', component: loveship.FlexRow },
            [TSkin.Promo]: { type: '@epam/promo:FlexRowProps', component: promo.FlexRow },
        },
        doc: (doc: DocBuilder<uui.FlexRowProps | loveship.FlexRowProps | promo.FlexRowProps>) => {
            doc.merge('children', { examples: flexRowChildren });
            doc.merge('alignItems', { examples: ['normal', 'stretch', 'center', 'start', 'end', 'flex-start', 'flex-end', 'self-start', 'self-end', 'baseline', 'first baseline', 'last baseline', 'safe center', 'unsafe center'], editorType: 'StringWithExamplesEditor' });
            doc.merge('justifyContent', { examples: ['normal', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch', 'start', 'end', 'left', 'right', 'safe center', 'unsafe center'], editorType: 'StringWithExamplesEditor' });
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
