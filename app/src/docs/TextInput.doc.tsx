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
    TPreviewCellSize, TPreviewMatrix,
    TSkin,
} from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { TTextInputPreview } from './_types/previewIds';

export class TextInputDoc extends BaseDocsBlock {
    title = 'Text Input';

    static override config: TDocConfig = {
        name: 'TextInput',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form, TDocContext.Table],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TextInputProps', component: uui.TextInput },
            [TSkin.Loveship]: { type: '@epam/uui:TextInputProps', component: loveship.TextInput },
            [TSkin.Promo]: { type: '@epam/uui:TextInputProps', component: promo.TextInput },
            [TSkin.Electric]: { type: '@epam/uui:TextInputProps', component: electric.TextInput },
        },
        doc: (doc: DocBuilder<uui.TextInputProps>) => {
            doc.merge('type', { defaultValue: 'text' });
            doc.merge('mode', { defaultValue: 'form' });
            doc.merge('iconPosition', { defaultValue: 'left' });
            doc.merge('maxLength', { examples: [10, 20, 30] });
        },
        preview: (docPreview: DocPreviewBuilder<uui.TextInputProps>) => {
            const TEST_DATA = {
                value: 'Test',
                icon: 'action-account-fill.svg',
                placeholder: 'Test placeholder',
            };
            type TMatrixLocal = TPreviewMatrix<uui.TextInputProps>;
            const baseMatrix: TMatrixLocal = {
                size: { examples: '*' },
                icon: { examples: [undefined, TEST_DATA.icon] },
                iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                isDropdown: { values: [false, true] },
                onAccept: { examples: ['callback'] },
                onCancel: { examples: ['callback'] },
                value: { values: [undefined, TEST_DATA.value] },
            };
            const cellSize: TPreviewCellSize = '180-80';
            const formBaseMatrix: TMatrixLocal = { mode: { examples: ['form'] }, ...baseMatrix };
            docPreview.add(TTextInputPreview['Form'], formBaseMatrix, cellSize);
            docPreview.add(TTextInputPreview['Form Invalid'], { ...formBaseMatrix, isInvalid: { values: [true] } }, cellSize);
            docPreview.add(TTextInputPreview['Form Disabled'], { ...formBaseMatrix, isDisabled: { values: [true] } }, cellSize);
            docPreview.add(TTextInputPreview['Form ReadOnly'], { ...formBaseMatrix, isReadonly: { values: [true] } }, cellSize);
            const inlineBaseMatrix: TMatrixLocal = { mode: { examples: ['inline'] }, ...baseMatrix };
            docPreview.add(TTextInputPreview['Inline'], inlineBaseMatrix, cellSize);
            docPreview.add(TTextInputPreview['Inline Disabled'], { ...inlineBaseMatrix, isDisabled: { values: [true] } }, cellSize);
            docPreview.add(TTextInputPreview['Inline ReadOnly'], { ...inlineBaseMatrix, isReadonly: { values: [true] } }, cellSize);
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textInput/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/textInput/Size.example.tsx" />
                <DocExample title="Action" path="./_examples/textInput/Action.example.tsx" />
            </>
        );
    }
}
