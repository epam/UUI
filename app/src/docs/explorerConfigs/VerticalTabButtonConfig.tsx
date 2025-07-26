import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    DocBuilder,
    DocPreviewBuilder,
    TDocConfig,
    TDocContext,
    TPreviewCellSize, TPreviewMatrix,
    TSkin, TVerticalTabButtonPreview,
} from '@epam/uui-docs';

export const VerticalTabButtonExplorerConfig: TDocConfig = {
    id: 'verticalTabButton',
    name: 'VerticalTabButton',
    contexts: [TDocContext.VerticalTabButton],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:VerticalTabButtonProps', component: uui.VerticalTabButton },
        [TSkin.Loveship]: { type: '@epam/uui:VerticalTabButtonProps', component: loveship.VerticalTabButton },
        [TSkin.Promo]: { type: '@epam/uui:VerticalTabButtonProps', component: promo.VerticalTabButton },
        [TSkin.Electric]: { type: '@epam/uui:VerticalTabButtonProps', component: electric.VerticalTabButton },
    },
    doc: (doc: DocBuilder<uui.VerticalTabButtonProps<unknown, unknown>>) => {
        doc.merge('iconPosition', { defaultValue: 'left' });
    },
    preview: (docPreview: DocPreviewBuilder<uui.VerticalTabButtonProps<unknown, unknown>>) => {
        const TEST_DATA = {
            caption: 'Test',
            callback: 'callback',
            href: 'https://google.com',
            icon: 'action-account-fill.svg',
        };
        const w200_h55: TPreviewCellSize = '200-55';
        type TMatrixLocal = TPreviewMatrix<uui.VerticalTabButtonProps<unknown, unknown>>;
        const statesMatrix: TMatrixLocal = {
            size: { values: ['36'] },
            isLinkActive: { values: [false, true] },
            isDisabled: { values: [false, true] },
        };
        const baseMatrix: TMatrixLocal = {
            href: { values: [TEST_DATA.href] },
            caption: { values: [TEST_DATA.caption] },
            isLinkActive: { values: [true] },
            size: { examples: '*' },
            indent: { values: [0, 1, 2] },
            isFoldable: { values: [true], condition: (props) => props.indent > 0 },
        };

        docPreview.add(TVerticalTabButtonPreview['Size Variants'], {
            ...baseMatrix,
            withNotify: { values: [true, false] },
            icon: { examples: [undefined, TEST_DATA.icon] },
            iconPosition: { examples: '*', condition: (props) => !!props.icon },
        }, '180-70');
        docPreview.add(TVerticalTabButtonPreview['States'], {
            ...baseMatrix,
            ...statesMatrix,
            withNotify: { values: [true] },
            icon: { examples: [TEST_DATA.icon] },
            iconPosition: { examples: ['left'] },
        }, w200_h55);
    },
};
