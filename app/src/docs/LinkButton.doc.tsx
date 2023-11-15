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

export class LinkButtonDoc extends BaseDocsBlock {
    title = 'Link Button';

    override config: TDocConfig = {
        name: 'LinkButton',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:LinkButtonProps', component: uui.LinkButton },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:LinkButtonProps',
                component: loveship.LinkButton,
                doc: (doc: DocBuilder<loveship.LinkButtonProps>) => doc.withContexts(loveshipDocs.FormContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:LinkButtonProps',
                component: promo.LinkButton,
                doc: (doc: DocBuilder<promo.LinkButtonProps>) => doc.withContexts(promoDocs.FormContext),
            },
        },
        doc: (doc: DocBuilder<promo.LinkButtonProps | loveship.LinkButtonProps | uui.LinkButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="link-button-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Link Button" path="./_examples/linkButton/Default.example.tsx" />

                <DocExample title="Sizes" path="./_examples/linkButton/Size.example.tsx" />

                <DocExample title="Icon Positions" path="./_examples/linkButton/IconPosition.example.tsx" />

                {this.renderSectionTitle('Examples')}
                <DocExample title="Secondary action in small footer" path="./_examples/common/Card.example.tsx" />

                <DocExample title="Sorting" path="./_examples/linkButton/Sorting.example.tsx" />
            </>
        );
    }
}
