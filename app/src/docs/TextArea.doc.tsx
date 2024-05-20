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
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';
import { TTextAreaPreview } from './_types/previewIds';

export class TextAreaDoc extends BaseDocsBlock {
    title = 'TextArea';

    static override config: TDocConfig = {
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
                value: 'Test 1\nTest 2',
                placeholder: 'Test placeholder',
            };
            type TMatrixLocal = TPreviewMatrix<uui.TextAreaProps>;
            const w210_h90: TPreviewCellSize = '210-90';
            const w210_h70: TPreviewCellSize = '210-70';

            const baseMatrix: TMatrixLocal = {
                value: { values: [TEST_DATA.value, undefined] },
                placeholder: { values: [undefined, TEST_DATA.placeholder], condition: (props) => !props.value },
                mode: { values: ['form', 'inline', 'cell'] },
                maxLength: { values: [undefined] },
                autoSize: { values: [false, true] },
            };
            const statesBaseMatrix: TMatrixLocal = {
                isInvalid: { values: [false, true] },
                isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
                isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
            };

            docPreview.add(TTextAreaPreview.Sizes, { ...baseMatrix, size: { examples: '*' } }, w210_h90);
            docPreview.add(
                TTextAreaPreview.States,
                {
                    ...baseMatrix,
                    size: { values: ['36'] },
                    autoSize: { values: [false] },
                    ...statesBaseMatrix,
                },
                w210_h70,
            );
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textArea-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textArea/Basic.example.tsx" />
                <DocExample title="Height configuration" path="./_examples/textArea/HeightConfiguration.example.tsx" />
                <DocExample title="With length limit" path="./_examples/textArea/MaxLengthCounter.example.tsx" />
            </>
        );
    }
}
