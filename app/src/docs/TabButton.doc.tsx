import React from 'react';
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
    TSkin,
} from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { TTabButtonPreview } from './_types/previewIds';

export class TabButtonDoc extends BaseDocsBlock {
    title = 'Tab Button';

    static override config: TDocConfig = {
        name: 'TabButton',
        contexts: [TDocContext.TabButton],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TabButtonProps', component: uui.TabButton },
            [TSkin.Electric]: { type: '@epam/uui:TabButtonProps', component: electric.TabButton },
            [TSkin.Loveship]: { type: '@epam/uui:TabButtonProps', component: loveship.TabButton },
            [TSkin.Promo]: { type: '@epam/uui:TabButtonProps', component: promo.TabButton },
        },
        doc: (doc: DocBuilder<uui.TabButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
        preview: (docPreview: DocPreviewBuilder<uui.TabButtonProps>) => {
            const TEST_DATA = {
                count: 999,
                caption: 'Test',
                callback: 'callback',
                href: 'https://google.com',
                icon: 'action-account-fill.svg',
            };
            const w190_h70: TPreviewCellSize = '190-70';
            const w165_h55: TPreviewCellSize = '165-55';
            type TMatrixLocal = TPreviewMatrix<uui.TabButtonProps>;
            const statesMatrix: TMatrixLocal = {
                size: { values: ['36'] },
                isLinkActive: { values: [false, true] },
                isDisabled: { values: [false, true] },
            };
            const baseMatrix: TMatrixLocal = {
                href: { values: [TEST_DATA.href] },
                caption: { values: [TEST_DATA.caption] },
                isLinkActive: { values: [true] },
                count: { values: [undefined, TEST_DATA.count] },
                withNotify: { values: [true, false] },
                icon: { examples: [undefined, TEST_DATA.icon] },
                iconPosition: { examples: '*', condition: (props) => !!props.icon },
                size: { examples: '*' },
                onClear: { examples: [undefined, TEST_DATA.callback] },
                isDisabled: { values: [false] },
            };

            docPreview.add(TTabButtonPreview['Basic'], { ...baseMatrix }, w190_h70);
            docPreview.add(TTabButtonPreview['Basic States'], { ...baseMatrix, ...statesMatrix }, w165_h55);
            docPreview.add(TTabButtonPreview['Basic Dropdown'], { ...baseMatrix, isDropdown: { values: [true] } }, w190_h70);
            docPreview.add(TTabButtonPreview['Basic Dropdown States'], { ...baseMatrix, isDropdown: { values: [true] }, ...statesMatrix }, w165_h55);
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tab-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tabButton/Basic.example.tsx" />
            </>
        );
    }
}
