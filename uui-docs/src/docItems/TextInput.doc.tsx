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
} from '../';
import { TTextInputPreview } from './_types/previewIds';
import { DocItem } from './_types/docItem';

export const textInputExplorerConfig: TDocConfig = {
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
        const statesBaseMatrix: TMatrixLocal = {
            isInvalid: { values: [false, true] },
            isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
            isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
        };
        const baseMatrix: TMatrixLocal = {
            isDropdown: { values: [false, true] },
            onAccept: { examples: ['callback'] },
            onCancel: { examples: ['callback'] },
            value: { values: [undefined, TEST_DATA.value] },
        };
        const w180_h80: TPreviewCellSize = '180-80';
        const w180_h50: TPreviewCellSize = '180-50';

        docPreview.add(TTextInputPreview['Size Variants'], {
            size: { examples: '*' },
            mode: { examples: ['form'] },
            isDropdown: { values: [false, true] },
            icon: { examples: [undefined, TEST_DATA.icon] },
            iconPosition: { examples: '*', condition: (pp) => !!pp.icon },
            ...baseMatrix,
        }, w180_h80);

        docPreview.add(TTextInputPreview['States'], {
            mode: { examples: ['form', 'inline', 'cell'] },
            size: { values: ['30'] },
            isDropdown: { values: [true] },
            icon: { examples: [TEST_DATA.icon] },
            iconPosition: { examples: ['left'] },
            placeholder: { values: [TEST_DATA.placeholder], condition: (props) => !props.value },
            ...baseMatrix,
            ...statesBaseMatrix,
        }, w180_h50);
    },
};

export const TextInputDocItem: DocItem = {
    id: 'textInput',
    name: 'Text Input',
    parentId: 'components',
    examples: [
        { descriptionPath: 'textInput-descriptions' },
        { name: 'Basic', componentPath: './_examples/textInput/Basic.example.tsx' },
        { name: 'Size', componentPath: './_examples/textInput/Size.example.tsx' },
        { name: 'Action', componentPath: './_examples/textInput/Action.example.tsx' },
    ],
    explorerConfig: textInputExplorerConfig,
};
