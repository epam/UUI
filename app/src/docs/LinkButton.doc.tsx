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
import { TLinkButtonPreview } from './_types/previewIds';

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
                caption: 'Test',
                icon: 'action-account-fill.svg',
            };
            docPreview.add({
                id: TLinkButtonPreview['Size Variants'],
                matrix: [
                    // 1-line caption
                    {
                        caption: { values: [TEST_DATA.caption] },
                        size: { examples: '*' },
                        icon: { examples: [TEST_DATA.icon, undefined] },
                        underline: { examples: ['solid', 'dashed'], condition: (pp) => !!pp.icon },
                        iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                        isDropdown: { examples: '*' },
                    },
                ],
                cellSize: '90-50',
            });
            docPreview.add({
                id: TLinkButtonPreview['Color Variants'],
                matrix: {
                    caption: { values: [TEST_DATA.caption] },
                    weight: { examples: '*' },
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
