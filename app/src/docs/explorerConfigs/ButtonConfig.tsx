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
    TDocContext, TPreviewMatrix,
    TSkin,
    TButtonPreview,
} from '@epam/uui-docs';

export const buttonExplorerConfig: TDocConfig = {
    id: 'button',
    name: 'Button',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:ButtonProps', component: uui.Button },
        [TSkin.Loveship]: {
            type: '@epam/loveship:ButtonProps',
            component: loveship.Button,
            preview: (docPreview) => {
                docPreview.update(TButtonPreview['Size Variants'], (prev) => {
                    if (Array.isArray(prev)) {
                        return prev.map((i) => ({ shape: { examples: '*' }, ...i }));
                    }
                });
            },
        },
        [TSkin.Promo]: { type: '@epam/promo:ButtonProps', component: promo.Button },
        [TSkin.Electric]: { type: '@epam/uui:ButtonProps', component: electric.Button },
    },
    doc: (doc: DocBuilder<uui.ButtonProps | promo.ButtonProps | loveship.ButtonProps>, params) => {
        doc.merge('iconPosition', { defaultValue: 'left' });
        doc.merge('color', {
            editorType: getColorPickerComponent({
                ...COLOR_MAP,
                gray50: `var(--uui-${params.theme === 'loveship_dark' ? 'neutral-40' : 'neutral-60'})`,
                gray: `var(--uui-${params.theme === 'loveship_dark' ? 'neutral-50' : 'neutral-60'})`,
                neutral: `var(--uui-${params.theme === 'loveship_dark' ? 'neutral-50' : 'neutral-60'})`,
            }),
        });
        doc.setDefaultPropExample('onClick', () => true);
    },
    preview: (docPreview: DocPreviewBuilder<uui.ButtonProps | promo.ButtonProps | loveship.ButtonProps>) => {
        const TEST_DATA = {
            caption1Line: 'Test',
            // eslint-disable-next-line
            caption2Lines: (<>{'Test'}<br/>{'Test'}</>),
            icon: 'action-account-fill.svg',
        };
        type TMatrixLocal = TPreviewMatrix<uui.ButtonProps | promo.ButtonProps | loveship.ButtonProps>;
        docPreview.add({
            id: TButtonPreview['Size Variants'],
            matrix: [
                {
                    caption: { values: [TEST_DATA.caption1Line] },
                    size: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon, undefined] },
                    iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                },
                {
                    caption: { values: [undefined] },
                    size: { examples: '*' },
                    icon: { examples: [TEST_DATA.icon] },
                    isDropdown: { examples: '*' },
                },
            ],
            cellSize: '150-70',
        });
        const colorVariantsMatrix: TMatrixLocal = {
            caption: { values: [TEST_DATA.caption1Line] },
            icon: { examples: [TEST_DATA.icon] },
            isDropdown: { values: [true] },
            color: { examples: '*' },
            fill: { examples: '*' },
            isDisabled: { examples: '*' },
        };
        docPreview.add(TButtonPreview['Color Variants'], colorVariantsMatrix, '100-50');
    },
};
