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
import { TLinkButtonPreview } from '@epam/uui-docs';

export const LinkButtonConfig: TDocConfig = {
    id: 'linkButton',
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
    doc: (doc: DocBuilder<promo.LinkButtonProps | loveship.LinkButtonProps | uui.LinkButtonProps>, params) => {
        doc.merge('iconPosition', { defaultValue: 'left' });
        doc.merge('color', {
            editorType: getColorPickerComponent({
                ...COLOR_MAP,
                contrast: `var(--uui-${params.theme === 'loveship_dark' ? 'neutral-0' : 'neutral-10'})`,
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
