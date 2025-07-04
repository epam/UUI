import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import {
    DocBuilder,
    DocPreviewBuilder,
    TDocConfig,
    TDocContext,
    TPreviewMatrix,
    TSkin,
} from '../';
import { TTextAreaPreview } from './_types/previewIds';
import { DocItem } from './_types/docItem';

export const textAreaExplorerConfig: TDocConfig = {
    name: 'TextArea',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
    bySkin: {
        [TSkin.Loveship]: { type: '@epam/uui:TextAreaProps', component: loveship.TextArea },
        [TSkin.Promo]: { type: '@epam/uui:TextAreaProps', component: promo.TextArea },
        [TSkin.UUI]: { type: '@epam/uui:TextAreaProps', component: uui.TextArea },
        [TSkin.Electric]: { type: '@epam/uui:TextAreaProps', component: electric.TextArea },
    },
    doc: (doc: DocBuilder<uui.TextAreaProps>) => {
        doc.merge('mode', { defaultValue: 'form' });
        doc.merge('rows', { examples: [1, 10, 20, 30] });
        doc.merge('maxLength', { examples: [5, 30, 50, 120] });
    },
    preview: (docPreview: DocPreviewBuilder<uui.TextAreaProps>) => {
        const TEST_DATA = {
            value: 'Test 1',
            longValue: 'Test 1\nTest 2\nTest3\nTest4',
            placeholder: 'Test placeholder',
        };
        type TMatrixLocal = TPreviewMatrix<uui.TextAreaProps>;

        const baseMatrix: TMatrixLocal = {
            value: { values: [undefined, TEST_DATA.value, TEST_DATA.longValue] },
            placeholder: { values: [TEST_DATA.placeholder], condition: (props) => !props.value },
            maxLength: { values: [undefined] },
            autoSize: { values: [false, true] },
        };
        const statesBaseMatrix: TMatrixLocal = {
            isInvalid: { values: [false, true] },
            isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
            isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
        };

        docPreview.add(TTextAreaPreview['Size Variants'], { ...baseMatrix, size: { examples: '*' } }, '210-130');
        docPreview.add(
            TTextAreaPreview['States'],
            {
                ...baseMatrix,
                size: { values: ['36'] },
                autoSize: { values: [false] },
                mode: { values: ['form', 'inline', 'cell'] },
                ...statesBaseMatrix,
            },
            '210-70',
        );
    },
};

export const TextAreaDocItem: DocItem = {
    id: 'textArea',
    name: 'Text Area',
    parentId: 'components',
    examples: [
        { descriptionPath: 'textArea-descriptions' },
        { name: 'Basic', componentPath: './_examples/textArea/Basic.example.tsx' },
        { name: 'Height configuration', componentPath: './_examples/textArea/HeightConfiguration.example.tsx' },
        { name: 'With length limit', componentPath: './_examples/textArea/MaxLengthCounter.example.tsx' },
    ],
    explorerConfig: textAreaExplorerConfig,
};
