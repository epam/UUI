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
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { getCurrentTheme } from '../helpers';

enum TLinkButtonPreview {
    'One-line caption' = 'One-line caption',
    'Two-line caption' = 'Two-line caption',
    'No caption' = 'No caption',
    Colors = 'Colors'
}

export class LinkButtonDoc extends BaseDocsBlock {
    title = 'Link Button';

    static override config: TDocConfig = {
        name: 'LinkButton',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:LinkButtonProps', component: uui.LinkButton },
            [TSkin.Electric]: { type: '@epam/uui:LinkButtonProps', component: electric.LinkButton },
            [TSkin.Loveship]: {
                type: '@epam/loveship:LinkButtonProps',
                component: loveship.LinkButton,
            },
            [TSkin.Promo]: { type: '@epam/promo:LinkButtonProps', component: promo.LinkButton },
        },
        doc: (doc: DocBuilder<promo.LinkButtonProps | loveship.LinkButtonProps | uui.LinkButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
            doc.merge('color', {
                editorType: getColorPickerComponent({
                    ...COLOR_MAP,
                    contrast: `var(--uui-${getCurrentTheme() === 'loveship_dark' ? 'neutral-0' : 'neutral-10'})`,
                }),
            });
            doc.setDefaultPropExample('onClick', () => true);
        },
        preview: (docPreview: DocPreviewBuilder<promo.LinkButtonProps | loveship.LinkButtonProps | uui.LinkButtonProps>) => {
            const TEST_DATA = {
                caption1Line: 'Test',
                // eslint-disable-next-line
                caption2Lines: (<>{'Test'}<br/>{'Test'}</>),
                icon: 'action-account-fill.svg',
            };
            docPreview.add({
                id: TLinkButtonPreview['One-line caption'],
                matrix: {
                    caption: { values: [TEST_DATA.caption1Line] },
                    size: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                    isDropdown: { examples: '*' },
                },
                cellSize: '100-60',
            });
            docPreview.add({
                id: TLinkButtonPreview['Two-line caption'],
                matrix: {
                    caption: { values: [TEST_DATA.caption2Lines] },
                    size: { examples: '*' },
                    isDropdown: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*' },
                },
                cellSize: '100-80',
            });
            docPreview.add({
                id: TLinkButtonPreview['No caption'],
                matrix: {
                    caption: { values: [undefined] },
                    size: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    isDropdown: { examples: '*', condition: (pp, v) => !v ? !!pp.icon : true },
                },
                cellSize: '80-50',
            });
            docPreview.add({
                id: TLinkButtonPreview.Colors,
                matrix: {
                    caption: { values: [TEST_DATA.caption1Line] },
                    icon: { examples: [TEST_DATA.icon] },
                    isDropdown: { values: [true] },
                    color: { examples: '*' },
                    isDisabled: { examples: '*' },
                },
                cellSize: '90-50',
            });
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
