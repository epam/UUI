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
import { ReactComponent as ActionIcon } from '@epam/assets/icons/action-account-fill.svg';

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
            doc.setDefaultPropExample('isLinkActive', ({ value }) => value === true);
            doc.merge('count', { examples: [
                { value: '9' },
                { value: '19' },
                { value: '99+' },
            ] });
            doc.setDefaultPropExample('icon', ({ value }) => value === ActionIcon);
        },
        preview: (docPreview: DocPreviewBuilder<uui.TabButtonProps>) => {
            const TEST_DATA = {
                count: '9',
                caption: 'Test',
                callback: 'callback',
                href: 'https://google.com',
                icon: 'action-account-fill.svg',
            };
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
                size: { examples: '*' },
            };

            docPreview.add(TTabButtonPreview['Size Variants'], {
                ...baseMatrix,
                count: { values: [undefined, TEST_DATA.count] },
                withNotify: { values: [true, false] },
                icon: { examples: [undefined, TEST_DATA.icon] },
                iconPosition: { examples: '*', condition: (props) => !!props.icon },
                isDropdown: { values: [true, false] },
            }, '140-55');
            docPreview.add(TTabButtonPreview['States'], {
                ...baseMatrix,
                ...statesMatrix,
                count: { values: [TEST_DATA.count] },
                withNotify: { values: [true] },
                icon: { examples: [TEST_DATA.icon] },
                iconPosition: { examples: ['left'] },
                onClear: { examples: [TEST_DATA.callback] },
                isDropdown: { values: [true] },
            }, w165_h55);
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
