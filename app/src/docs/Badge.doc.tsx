import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';

export class BadgeDoc extends BaseDocsBlock {
    title = 'Badge';

    override config: TDocConfig = {
        name: 'Badge',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:BadgeProps', component: uui.Badge },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:BadgeProps',
                component: loveship.Badge,
                doc: (doc: DocBuilder<uui.BadgeProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:BadgeProps',
                component: promo.Badge,
                doc: (doc: DocBuilder<promo.BadgeProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<uui.BadgeProps | promo.BadgeProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="badge-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Types" path="./_examples/badge/Types.example.tsx" />
                <DocExample title="Color variants" path="./_examples/badge/Colors.example.tsx" />
                <DocExample title="Styles" path="./_examples/badge/Styles.example.tsx" />
                <DocExample title="Sizes" path="./_examples/badge/Size.example.tsx" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Attributes" path="./_examples/badge/Attributes.example.tsx" />
                <DocExample title="Dropdown" path="./_examples/badge/Dropdown.example.tsx" />
                <DocExample title="Badge width status indicator" path="./_examples/badge/StatusIndicator.example.tsx" />
            </>
        );
    }
}
