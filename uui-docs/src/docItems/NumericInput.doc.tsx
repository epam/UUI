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
} from '../';
import { TNumericInputPreview } from './_types/previewIds';
import { DocItem } from './_types/docItem';

export const numericInputExplorerConfig: TDocConfig = {
    name: 'NumericInput',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Table, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:NumericInputProps', component: uui.NumericInput },
        [TSkin.Loveship]: { type: '@epam/uui:NumericInputProps', component: loveship.NumericInput },
        [TSkin.Promo]: { type: '@epam/uui:NumericInputProps', component: promo.NumericInput },
        [TSkin.Electric]: { type: '@epam/uui:NumericInputProps', component: electric.NumericInput },
    },
    doc: (doc: DocBuilder<uui.NumericInputProps>) => {
        doc.merge('value', { examples: [{ value: 0, isDefault: true }, 123, 123.99] });
        doc.merge('step', { examples: [5, 10, 100] });
        doc.merge('min', { examples: [-10, 0, 10] });
        doc.merge('max', { examples: [20, 50, 500] });
        doc.merge('mode', { defaultValue: 'form' });
        doc.merge('formatOptions', {
            examples: [
                { name: 'fraction = 2', value: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                { name: 'fraction <= 2', value: { maximumFractionDigits: 2 } },
                { name: 'fraction >= 2', value: { minimumFractionDigits: 2 } },
            ],
            editorType: 'JsonEditor',
        });
    },
    preview: (docPreview: DocPreviewBuilder<uui.NumericInputProps>) => {
        const TEST_DATA = {
            value: 1234,
            placeholder: 'Test',
        };
        const w160_h45: TPreviewCellSize = '160-45';
        const w120_h60: TPreviewCellSize = '120-60';
        type TMatrixLocal = TPreviewMatrix<uui.NumericInputProps>;
        const baseMatrix: TMatrixLocal = {
            placeholder: { values: [TEST_DATA.placeholder] },
            value: { values: [undefined, TEST_DATA.value] },
        };
        const statesBaseMatrix: TMatrixLocal = {
            size: { values: ['30'] },
            disableArrows: { values: [false] },
            isInvalid: { values: [false, true] },
            isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
            isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
        };

        docPreview.add({
            id: TNumericInputPreview['Size Variants'],
            matrix: {
                mode: { values: ['form'] },
                size: { examples: '*' },
                disableArrows: { values: [false, true] },
                align: { values: ['left', 'right'] },
                ...baseMatrix,
            },
            cellSize: w120_h60,
        });
        docPreview.add({
            id: TNumericInputPreview['States'],
            matrix: {
                mode: { values: ['form', 'inline', 'cell'] },
                ...baseMatrix,
                ...statesBaseMatrix,
            },
            cellSize: w160_h45,
        });
    },
};

export const NumericInputDocItem: DocItem = {
    id: 'numericInput',
    name: 'Numeric Input',
    parentId: 'components',
    examples: [
        { descriptionPath: 'numericInput-descriptions' },
        { name: 'Basic', componentPath: './_examples/numericInput/Basic.example.tsx' },
        { name: 'Formatting options', componentPath: './_examples/numericInput/Formatting.example.tsx' },
        { name: 'Size', componentPath: './_examples/numericInput/Size.example.tsx' },
    ],
    explorerConfig: numericInputExplorerConfig,
};
