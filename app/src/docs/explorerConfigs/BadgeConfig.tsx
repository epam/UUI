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
    TDocContext, TPreviewMatrix,
    TSkin,
} from '@epam/uui-docs';
import { TBadgePreview } from '@epam/uui-docs';
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

export const BadgeConfig: TDocConfig = {
    id: 'badge',
    name: 'Badge',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: {
            type: '@epam/uui:BadgeProps',
            component: uui.Badge,
        },
        [TSkin.Loveship]: { type: '@epam/loveship:BadgeProps', component: loveship.Badge },
        [TSkin.Promo]: { type: '@epam/promo:BadgeProps', component: promo.Badge },
        [TSkin.Electric]: { type: '@epam/electric:BadgeProps', component: electric.Badge },
    },
    doc: (doc: DocBuilder<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>, params) => {
        doc.setDefaultPropExample('onClick', () => true);
        doc.merge('color', {
            defaultValue: 'info',
            editorType: getColorPickerComponent({
                ...COLOR_MAP,
                neutral: `var(--uui-${params.theme === 'loveship_dark' ? 'neutral-40' : 'neutral-30'})`,
            }),
        });
        doc.merge('count', { examples: [
            { value: '9' },
            { value: '19' },
            { value: '99+' },
        ] });
        doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
    },
    preview: (docPreview: DocPreviewBuilder<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>) => {
        type TMatrixLocal = TPreviewMatrix<uui.BadgeProps | promo.BadgeProps | loveship.BadgeProps | electric.BadgeProps>;
        const TEST_DATA = {
            caption: 'Test',
            icon: 'action-account-fill.svg',
            count: '99+',
        };
        const colorVariantsBase: TMatrixLocal = {
            caption: { values: [TEST_DATA.caption] },
            isDropdown: { values: [true] },
            count: { values: [TEST_DATA.count] },
        };
        docPreview.add({
            id: TBadgePreview['Color Variants'],
            matrix: [
                {
                    ...colorVariantsBase,
                    fill: { values: ['solid', 'outline'] },
                    color: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon] },
                },
                {
                    ...colorVariantsBase,
                    fill: { values: ['outline'] },
                    color: { examples: '*' },
                    icon: { examples: [undefined] },
                    indicator: { values: [true] },
                },
            ],
            cellSize: '150-50',
        });
        docPreview.add({
            id: TBadgePreview['Size Variants'],
            matrix: [
                {
                    caption: { values: [TEST_DATA.caption] },
                    color: { values: ['info'] },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    size: { examples: '*' },
                    count: { values: [TEST_DATA.count, undefined] },
                    isDropdown: { values: [false, true] },
                },
                {
                    caption: { values: [TEST_DATA.caption] },
                    color: { values: ['info'] },
                    size: { examples: '*' },
                    count: { values: [TEST_DATA.count] },
                    isDropdown: { values: [true] },
                    icon: { examples: [TEST_DATA.icon] },
                    fill: { examples: ['outline'] },
                    indicator: { values: [true] },
                    iconPosition: { values: ['right'] },
                },
            ],
            cellSize: '200-60',
        });
    },
};
