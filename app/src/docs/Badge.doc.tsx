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

enum TBadgePreview {
    'Colors' = 'Colors',
    'Sizes with icon' = 'Sizes with icon',
    'Sizes without icon' = 'Sizes without icon'
}

export class BadgeDoc extends BaseDocsBlock {
    title = 'Badge';

    static override config: TDocConfig = {
        name: 'Badge',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:BadgeProps',
                component: uui.Badge,
            },
            [TSkin.Loveship]: {
                type: '@epam/loveship:BadgeProps',
                component: loveship.Badge,
                doc: (doc: DocBuilder<loveship.BadgeProps>) => {
                    doc.setDefaultPropExample('shape', ({ value }) => value === 'round');
                },
                preview: (docPreview: DocPreviewBuilder<loveship.BadgeProps>) => {
                    docPreview.update(TBadgePreview['Sizes with icon'], (prev) => ({ shape: { examples: '*' }, ...prev }));
                    docPreview.update(TBadgePreview['Sizes without icon'], (prev) => ({ shape: { examples: '*' }, ...prev }));
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
            const TEST_DATA = {
                caption: 'Test',
                icon: 'action-account-fill.svg',
                count: 123,
            };
            docPreview.add({
                id: TBadgePreview.Colors,
                matrix: {
                    caption: { values: [TEST_DATA.caption] },
                    isDropdown: { values: [true] },
                    count: { values: [TEST_DATA.count] },
                    icon: { examples: [TEST_DATA.icon] },
                    fill: { examples: '*' },
                    color: { examples: '*' },
                },
                cellSize: '150-50',
            });
            docPreview.add({
                id: TBadgePreview['Sizes without icon'],
                matrix: {
                    icon: { examples: [undefined] },
                    caption: { values: [TEST_DATA.caption] },
                    color: { values: ['info'] },
                    size: { examples: '*' },
                    count: { values: [TEST_DATA.count, undefined] },
                    isDropdown: { examples: '*' },

                },
                cellSize: '140-60',
            });
            docPreview.add({
                id: TBadgePreview['Sizes with icon'],
                matrix: {
                    icon: { examples: [TEST_DATA.icon] },
                    caption: { values: [TEST_DATA.caption] },
                    color: { values: ['info'] },
                    size: { examples: '*' },
                    count: { values: [TEST_DATA.count, undefined] },
                    isDropdown: { examples: '*' },
                    iconPosition: { examples: '*' },
                },
                cellSize: '170-60',
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
