import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    COLOR_MAP,
    DocBuilder,
    DocPreviewBuilder,
    getColorPickerComponent,
    TDocConfig,
    TDocContext,
    TSkin,
} from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { getCurrentTheme } from '../helpers';

export class BadgeDoc extends BaseDocsBlock {
    title = 'Badge';

    static override config: TDocConfig = {
        name: 'Badge',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:BadgeProps', component: uui.Badge },
            [TSkin.Loveship]: {
                type: '@epam/loveship:BadgeProps',
                component: loveship.Badge,
                doc: (doc: DocBuilder<loveship.BadgeProps>) => {
                    doc.setDefaultPropExample('shape', ({ value }) => value === 'round');
                },
            },
            [TSkin.Promo]: { type: '@epam/promo:BadgeProps', component: promo.Badge },
            [TSkin.Electric]: { type: '@epam/electric:BadgeProps', component: electric.Badge },
        },
        doc: (doc: DocBuilder<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>) => {
            doc.setDefaultPropExample('size', ({ value }) => value === '36');
            doc.setDefaultPropExample('onClick', () => true);
            doc.merge('color', {
                defaultValue: 'info',
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    neutral: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-40' : 'neutral-30'})`,
                }),
            });
        },
        preview: (docPreview: DocPreviewBuilder<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>) => {
            docPreview.add({
                id: 'default',
                matrix: {
                    color: { examples: '*' },
                    size: { examples: '*' },
                },
            });
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
                <DocExample title="Badge with status indicator" path="./_examples/badge/StatusIndicator.example.tsx" />
            </>
        );
    }
}
