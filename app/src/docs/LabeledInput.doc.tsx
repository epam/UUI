import * as React from 'react';
import * as uui from '@epam/uui';
import * as promo from '@epam/promo';
import * as loveship from '@epam/loveship';
import * as electric from '@epam/electric';
import {
    DocBuilder,
    DocPreviewBuilder,
    TDocConfig,
    TDocContext,
    TPreviewCellSize, TPreviewMatrix,
    TSkin,
} from '@epam/uui-docs';
import { TLabeledInputPreview } from './_types/previewIds';
import { DocItem } from '../documents/structure';

export const labeledInputExplorerConfig: TDocConfig = {
    name: 'LabeledInput',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:LabeledInputProps', component: uui.LabeledInput },
        [TSkin.Electric]: { type: '@epam/uui:LabeledInputProps', component: electric.LabeledInput },
        [TSkin.Loveship]: { type: '@epam/uui:LabeledInputProps', component: loveship.LabeledInput },
        [TSkin.Promo]: { type: '@epam/uui:LabeledInputProps', component: promo.LabeledInput },
    },
    doc: (doc: DocBuilder<uui.LabeledInputProps>) => {
        doc.merge('value', { examples: ['Some simple text'] });
        doc.merge('Tooltip', { examples: [{ value: uui.Tooltip, name: 'Tooltip', isDefault: true }], isRequired: true });
        doc.merge('labelPosition', { defaultValue: 'top' });
        doc.merge('children', {
            examples: [
                { name: 'TextInput 48', value: <uui.TextInput value="text" size="48" onValueChange={ () => {} } /> },
                { name: 'TextInput 36', value: <uui.TextInput value="text" onValueChange={ () => {} } />, isDefault: true },
                { name: 'TextInput 30', value: <uui.TextInput value="text" size="30" onValueChange={ () => {} } /> },
                { name: 'TextInput 24', value: <uui.TextInput value="text" size="24" onValueChange={ () => {} } /> },
                { name: 'Checkbox', value: <uui.Checkbox value={ true } onValueChange={ () => {} } /> },
                { name: 'Slider', value: <uui.Slider min={ 0 } max={ 100 } value={ 50 } onValueChange={ () => {} } step={ 5 } /> },
            ],
        });
    },
    preview: (docPreview: DocPreviewBuilder<uui.LabeledInputProps>) => {
        const TEST_DATA = {
            label: 'Test',
            footNote: 'Foot',
            sideNote: 'Side',
            info: 'Info',
            value: 'Test',
            validationMsg: 'Msg',
            maxLength: 15,
            getChildren: (size: uui.LabeledInputProps['size']) => {
                return <uui.TextInput value="text" size={ size } onValueChange={ () => { } } />;
            },
        };
        type TMatrixLocal = TPreviewMatrix<uui.LabeledInputProps>;
        const w280_h75: TPreviewCellSize = '280-75';
        const w250_h120: TPreviewCellSize = '250-120';
        const w190_h100: TPreviewCellSize = '190-100';

        const commonBase: TMatrixLocal = {
            children: { values: [TEST_DATA.getChildren('24')] },
            label: { values: [TEST_DATA.label] },
            maxLength: { values: [TEST_DATA.maxLength] },
            value: { values: [TEST_DATA.value] },
        };
        const stateVariantsBase: TMatrixLocal = {
            ...commonBase,
            size: { values: ['24'] },
            charCounter: { values: [false, true] },
            sidenote: { values: [undefined, TEST_DATA.sideNote] },
            footnote: { values: [undefined, TEST_DATA.footNote] },
            info: { values: [undefined, TEST_DATA.info] },
            isInvalid: { values: [false, true] },
            validationMessage: { values: [TEST_DATA.validationMsg], condition: (p) => !!p.isInvalid },
            isOptional: { values: [true], condition: (props) => { return (props.labelPosition as any) !== 'left' && !props.isRequired; } },
            isRequired: { values: [false, true] },
        };
        docPreview.add(TLabeledInputPreview['Label Top Cases'], { labelPosition: { values: ['top'] }, ...stateVariantsBase }, w190_h100);
        docPreview.add(TLabeledInputPreview['Label Left Cases'], { labelPosition: { values: ['left'] }, ...stateVariantsBase, sidenote: { values: [undefined] } }, w280_h75);
        docPreview.add({
            id: TLabeledInputPreview['Size Variants'],
            matrix: {
                ...commonBase,
                size: { examples: '*' },
                info: { values: [TEST_DATA.info] },
                charCounter: { values: [true] },
                footnote: { values: [TEST_DATA.footNote] },
                sidenote: { values: [TEST_DATA.sideNote] },
                isInvalid: { values: [true] },
                validationMessage: { values: [TEST_DATA.validationMsg], condition: (props) => !!props.isInvalid },
                isOptional: { values: [true] },
            },
            cellSize: w250_h120,
        });
    },
};

export const LabeledInputDocItem: DocItem = {
    id: 'labeledInput',
    name: 'Labeled Input',
    parentId: 'components',
    examples: [
        { descriptionPath: 'labeledInput-descriptions' },
        { name: 'Basic', componentPath: './_examples/labeledInput/Basic.example.tsx' },
    ],
    explorerConfig: labeledInputExplorerConfig,
};
