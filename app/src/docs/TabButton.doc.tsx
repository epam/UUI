import React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    DocBuilder,
    DocPreviewBuilder,
    TComponentPreview,
    TDocConfig,
    TDocContext,
    TPreviewCellSize,
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
            const cellSize: TPreviewCellSize = '190-70';
            const baseMatrix: TComponentPreview<uui.TabButtonProps>['matrix'] = {
                href: { values: [TEST_DATA.href] },
                caption: { values: [TEST_DATA.caption] },
                count: { values: [undefined, TEST_DATA.count] },
                withNotify: { values: [true, false] },
                icon: { examples: [undefined, TEST_DATA.icon] },
                iconPosition: { examples: '*', condition: (props) => !!props.icon },
                size: { examples: '*' },
            };

            docPreview.add({
                id: TTabButtonPreview['Active'],
                matrix: {
                    isLinkActive: { values: [true] },
                    isDisabled: { values: [false] },
                    isDropdown: { values: [false] },
                    ...baseMatrix,
                    onClear: { examples: [undefined, TEST_DATA.callback] },
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Active Disabled'],
                matrix: {
                    isLinkActive: { values: [true] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [false] },
                    ...baseMatrix,
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Active Dropdown'],
                matrix: {
                    isLinkActive: { values: [true] },
                    isDisabled: { values: [false] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [false] },
                    ...baseMatrix,
                    onClear: { examples: [undefined, TEST_DATA.callback] },
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Active Dropdown Disabled'],
                matrix: {
                    isLinkActive: { values: [true] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [false] },
                    ...baseMatrix,
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Active Dropdown Open'],
                matrix: {
                    isLinkActive: { values: [true] },
                    isDisabled: { values: [false] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [true] },
                    ...baseMatrix,
                    onClear: { examples: [undefined, TEST_DATA.callback] },
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Active Dropdown Open Disabled'],
                matrix: {
                    isLinkActive: { values: [true] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [true] },
                    ...baseMatrix,
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Inactive'],
                matrix: {
                    isLinkActive: { values: [false] },
                    isDisabled: { values: [false] },
                    isDropdown: { values: [false] },
                    ...baseMatrix,
                    onClear: { examples: [undefined, TEST_DATA.callback] },
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Inactive Disabled'],
                matrix: {
                    isLinkActive: { values: [false] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [false] },
                    ...baseMatrix,
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Inactive Dropdown'],
                matrix: {
                    isLinkActive: { values: [false] },
                    isDisabled: { values: [false] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [false] },
                    ...baseMatrix,
                    onClear: { examples: [undefined, TEST_DATA.callback] },
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Inactive Dropdown Disabled'],
                matrix: {
                    isLinkActive: { values: [false] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [false] },
                    ...baseMatrix,
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Inactive Dropdown Open'],
                matrix: {
                    isLinkActive: { values: [false] },
                    isDisabled: { values: [false] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [true] },
                    ...baseMatrix,
                    onClear: { examples: [undefined, TEST_DATA.callback] },
                },
                cellSize,
            });
            docPreview.add({
                id: TTabButtonPreview['Inactive Dropdown Open Disabled'],
                matrix: {
                    isLinkActive: { values: [false] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [true] },
                    isOpen: { values: [true] },
                    ...baseMatrix,
                },
                cellSize,
            });
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
