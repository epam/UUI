import React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as uuiDocs from './_props/uui/docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class TabButtonDoc extends BaseDocsBlock {
    title = 'Tab Button';

    override config: TDocConfig = {
        name: 'TabButton',
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:TabButtonProps',
                component: uui.TabButton,
                doc: (doc: DocBuilder<uui.TabButtonProps>) => doc.withContextsReplace(uuiDocs.TabButtonContext),
            },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:TabButtonProps',
                component: loveship.TabButton,
                doc: (doc: DocBuilder<loveship.TabButtonProps>) => doc.withContextsReplace(loveshipDocs.TabButtonContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:TabButtonProps',
                component: promo.TabButton,
                doc: (doc: DocBuilder<uui.TabButtonProps>) => doc.withContextsReplace(promoDocs.TabButtonContext),
            },
        },
        doc: (doc: DocBuilder<uui.TabButtonProps | loveship.TabButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tab-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tabButton/Basic.example.tsx" />
            </>
        );
    }
}
