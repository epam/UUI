import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TComponentPreview, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

enum TTextInputPreview {
    'Form'= 'Form',
    'Form (invalid)'= 'Form (invalid)',
    'Form (disabled)'= 'Form (disabled)',
    'Form (read only)'= 'Form (read only)',
    'Inline'= 'Inline',
    'Inline (disabled)'= 'Inline (disabled)',
    'Inline (read only)'= 'Inline (read only)'
}

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

            const baseMatrix: TComponentPreview<uui.TextInputProps>['matrix'] = {
                size: { examples: '*' },
                icon: { examples: [undefined, TEST_DATA.icon] },
                iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
                isDropdown: { values: [false, true] },
                onAccept: { examples: ['callback'] },
                onCancel: { examples: ['callback'] },
                value: { values: [undefined, TEST_DATA.value] },
            };
            docPreview.add({
                id: TTextInputPreview['Form'],
                matrix: {
                    mode: { examples: ['form'] },
                    ...baseMatrix,
                },
                cellSize: '180-80',
            });
            docPreview.add({
                id: TTextInputPreview['Form (invalid)'],
                matrix: {
                    mode: { examples: ['form'] },
                    isInvalid: { values: [true] },
                    ...baseMatrix,
                },
                cellSize: '180-80',
            });
            docPreview.add({
                id: TTextInputPreview['Form (disabled)'],
                matrix: {
                    mode: { examples: ['form'] },
                    isDisabled: { values: [true] },
                    ...baseMatrix,
                },
                cellSize: '180-80',
            });
            docPreview.add({
                id: TTextInputPreview['Form (read only)'],
                matrix: {
                    mode: { examples: ['form'] },
                    isReadonly: { values: [true] },
                    ...baseMatrix,
                },
                cellSize: '180-80',
            });
            //
            //
            //
            docPreview.add({
                id: TTextInputPreview['Inline'],
                matrix: {
                    mode: { examples: ['inline'] },
                    ...baseMatrix,
                },
                cellSize: '180-80',
            });
            docPreview.add({
                id: TTextInputPreview['Inline (disabled)'],
                matrix: {
                    mode: { examples: ['inline'] },
                    isDisabled: { values: [true] },
                    ...baseMatrix,
                },
                cellSize: '180-80',
            });
            docPreview.add({
                id: TTextInputPreview['Inline (read only)'],
                matrix: {
                    mode: { examples: ['inline'] },
                    isReadonly: { values: [true] },
                    ...baseMatrix,
                },
                cellSize: '180-80',
            });
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
