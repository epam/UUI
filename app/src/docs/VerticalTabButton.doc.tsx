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

export class VerticalTabButtonDoc extends BaseDocsBlock {
    title = 'Vertical Tab Button';

    override config: TDocConfig = {
        name: 'VerticalTabButton',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:VerticalTabButtonProps', component: uui.VerticalTabButton },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:VerticalTabButtonProps',
                component: loveship.VerticalTabButton,
                doc: (doc: DocBuilder<uui.VerticalTabButtonProps>) => doc.withContextsReplace(loveshipDocs.VerticalTabButtonContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:VerticalTabButtonProps',
                component: promo.VerticalTabButton,
                doc: (doc: DocBuilder<uui.VerticalTabButtonProps>) => doc.withContextsReplace(promoDocs.VerticalTabButtonContext),
            },
        },
        doc: (doc: DocBuilder<uui.VerticalTabButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="vertical-tab-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/verticalTabButton/Basic.example.tsx" />
            </>
        );
    }
}
