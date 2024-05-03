import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import {
    DocBuilder,
    DocPreviewBuilder,
    TComponentPreview,
    TDocConfig,
    TDocContext,
    TPreviewCellSize,
    TSkin,
} from '@epam/uui-docs';
import { TVerticalTabButtonPreview } from './_types/previewIds';

export class VerticalTabButtonDoc extends BaseDocsBlock {
    title = 'Vertical Tab Button';

    static override config: TDocConfig = {
        name: 'VerticalTabButton',
        contexts: [TDocContext.VerticalTabButton],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:VerticalTabButtonProps', component: uui.VerticalTabButton },
            [TSkin.Loveship]: { type: '@epam/uui:VerticalTabButtonProps', component: loveship.VerticalTabButton },
            [TSkin.Promo]: { type: '@epam/uui:VerticalTabButtonProps', component: promo.VerticalTabButton },
            [TSkin.Electric]: { type: '@epam/uui:VerticalTabButtonProps', component: electric.VerticalTabButton },
        },
        doc: (doc: DocBuilder<uui.VerticalTabButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
        preview: (docPreview: DocPreviewBuilder<uui.VerticalTabButtonProps>) => {
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
                id: TVerticalTabButtonPreview['Active'],
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
                id: TVerticalTabButtonPreview['Active Disabled'],
                matrix: {
                    isLinkActive: { values: [true] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [false] },
                    ...baseMatrix,
                },
                cellSize,
            });
            docPreview.add({
                id: TVerticalTabButtonPreview['Active Dropdown'],
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
                id: TVerticalTabButtonPreview['Active Dropdown Disabled'],
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
                id: TVerticalTabButtonPreview['Active Dropdown Open'],
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
                id: TVerticalTabButtonPreview['Active Dropdown Open Disabled'],
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
                id: TVerticalTabButtonPreview['Inactive'],
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
                id: TVerticalTabButtonPreview['Inactive Disabled'],
                matrix: {
                    isLinkActive: { values: [false] },
                    isDisabled: { values: [true] },
                    isDropdown: { values: [false] },
                    ...baseMatrix,
                },
                cellSize,
            });
            docPreview.add({
                id: TVerticalTabButtonPreview['Inactive Dropdown'],
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
                id: TVerticalTabButtonPreview['Inactive Dropdown Disabled'],
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
                id: TVerticalTabButtonPreview['Inactive Dropdown Open'],
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
                id: TVerticalTabButtonPreview['Inactive Dropdown Open Disabled'],
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
                <EditableDocContent fileName="vertical-tab-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/verticalTabButton/Basic.example.tsx" />
            </>
        );
    }
}
