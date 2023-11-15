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

export class IconContainerDoc extends BaseDocsBlock {
    title = 'Icon Container';

    override config: TDocConfig = {
        name: 'IconContainer',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:ControlIconProps', component: uui.IconContainer },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:IconContainerProps',
                component: loveship.IconContainer,
                doc: (doc: DocBuilder<loveship.IconContainerProps>) => doc.withContexts(loveshipDocs.FormContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:IconContainerProps',
                component: promo.IconContainer,
                doc: (doc: DocBuilder<promo.IconContainerProps>) => doc.withContexts(promoDocs.FormContext),
            },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="iconContainer-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconContainer/Basic.example.tsx" />
            </>
        );
    }
}
