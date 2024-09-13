import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';

import {
    DocBuilder,
    DocPreviewBuilder,
    TDocConfig,
    TDocContext,
    TPreviewCellSize,
    TPreviewMatrix,
    TSkin,
} from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { TPaginatorPreview } from './_types/previewIds';

export class PaginatorDoc extends BaseDocsBlock {
    title = 'Paginator';

    static override config: TDocConfig = {
        name: 'Paginator',
        contexts: [TDocContext.Default, TDocContext.PagePanel],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:PaginatorProps', component: uui.Paginator },
            [TSkin.Loveship]: { type: '@epam/uui:PaginatorProps', component: loveship.Paginator },
            [TSkin.Promo]: { type: '@epam/uui:PaginatorProps', component: promo.Paginator },
            [TSkin.Electric]: { type: '@epam/uui:PaginatorProps', component: electric.Paginator },
        },
        doc: (doc: DocBuilder<uui.PaginatorProps>) => {
            doc.merge('totalPages', { examples: [5, 8, { value: 10, isDefault: true }, 100, 1000] });
            doc.merge('value', { examples: [1, { value: 5, isDefault: true }, 6, 8], editorType: 'NumEditor' });
        },
        preview: (docPreview: DocPreviewBuilder<uui.PaginatorProps>) => {
            const TEST_DATA = {
                items: [{ caption: 'A', id: 1 }, { caption: 'B', id: 2 }],
                total5: {
                    totalPages: 5,
                    valuesToTest: [1, 5], // test very beginning and very end
                },
                total10: {
                    totalPages: 10,
                    valuesToTest: [2, 6, 8], // test overflow (3 dots) at different positions
                },
            };
            const w330_h60: TPreviewCellSize = '330-60';
            const w250_h60: TPreviewCellSize = '250-60';

            const sizeVariantsBase: TPreviewMatrix<uui.PaginatorProps> = {
                isDisabled: { values: [false] },
                size: { examples: '*' },
            };

            docPreview.add({
                id: TPaginatorPreview['Size Variants'],
                matrix: [
                    {
                        ...sizeVariantsBase,
                        totalPages: { values: [TEST_DATA.total5.totalPages] },
                        value: { values: TEST_DATA.total5.valuesToTest },
                    },
                    {
                        ...sizeVariantsBase,
                        totalPages: { values: [TEST_DATA.total10.totalPages] },
                        value: { values: TEST_DATA.total10.valuesToTest },
                    },
                ],
                cellSize: w330_h60,
            });
            docPreview.add({
                id: TPaginatorPreview['States'],
                matrix: {
                    isDisabled: { values: [false, true] },
                    size: { values: ['30'] },
                    totalPages: { values: [TEST_DATA.total5.totalPages] },
                    value: { values: [TEST_DATA.total5.valuesToTest[1]] },
                },
                cellSize: w250_h60,
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="paginator-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/paginator/Basic.example.tsx" />
            </>
        );
    }
}
