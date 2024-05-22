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
import { TRadioInputPreview } from './_types/previewIds';

export class RadioInputDoc extends BaseDocsBlock {
    title = 'RadioInput';

    static override config: TDocConfig = {
        name: 'RadioInput',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RadioInputProps', component: uui.RadioInput },
            [TSkin.Electric]: { type: '@epam/uui:RadioInputProps', component: electric.RadioInput },
            [TSkin.Loveship]: { type: '@epam/uui:RadioInputProps', component: loveship.RadioInput },
            [TSkin.Promo]: { type: '@epam/uui:RadioInputProps', component: promo.RadioInput },
        },
        doc: (doc: DocBuilder<uui.RadioInputProps>) => {
            doc.merge('value', { examples: [true, { value: false, isDefault: true }] });
        },
        preview: (docPreview: DocPreviewBuilder<uui.RadioInputProps>) => {
            const TEST_DATA = {
                label: 'Test',
            };
            const w75_h40: TPreviewCellSize = '75-40';
            type TMatrixLocal = TPreviewMatrix<uui.RadioInputProps>;
            const statesBaseMatrix: TMatrixLocal = {
                isInvalid: { values: [false, true] },
                isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
                isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
            };
            docPreview.add({
                id: TRadioInputPreview['Size Variants'],
                matrix: {
                    label: { values: [TEST_DATA.label, undefined] },
                    size: { examples: '*' },
                    value: { values: [true, false] },
                },
                cellSize: w75_h40,
            });
            docPreview.add({
                id: TRadioInputPreview['Color Variants'],
                matrix: {
                    size: { values: ['18'] },
                    value: { values: [true] },
                    label: { values: [TEST_DATA.label] },
                    ...statesBaseMatrix,
                },
                cellSize: w75_h40,
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="radioInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/radioInput/Basic.example.tsx" />
                <DocExample title="RadioInput Group" path="./_examples/radioInput/Group.example.tsx" />
            </>
        );
    }
}
