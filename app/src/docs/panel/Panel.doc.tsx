import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { childrenExamples } from './panelExamples';

export class PanelDoc extends BaseDocsBlock {
    title = 'Panel';

    static override config: TDocConfig = {
        name: 'Panel',
        contexts: [TDocContext.Resizable, TDocContext.Default],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:PanelProps', component: uui.Panel },
            [TSkin.Loveship]: { type: '@epam/loveship:PanelProps', component: loveship.Panel },
            [TSkin.Promo]: { type: '@epam/promo:PanelProps', component: promo.Panel },
            [TSkin.Electric]: { type: '@epam/uui:PanelProps', component: electric.Panel },
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
