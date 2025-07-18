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
import { TRadioGroupPreview } from '@epam/uui-docs';

export const RadioGroupConfig: TDocConfig = {
    id: 'radioGroup',
    name: 'RadioGroup',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:RadioGroupProps', component: uui.RadioGroup },
        [TSkin.Electric]: { type: '@epam/uui:RadioGroupProps', component: electric.RadioGroup },
        [TSkin.Loveship]: { type: '@epam/uui:RadioGroupProps', component: loveship.RadioGroup },
        [TSkin.Promo]: { type: '@epam/uui:RadioGroupProps', component: promo.RadioGroup },
    },
    doc: (doc: DocBuilder<uui.RadioGroupProps<any>>) => {
        doc.merge('items', {
            examples: [
                {
                    name: 'Languages',
                    value: [{ name: 'English', id: 1 }, { name: 'Russian', id: 2 }, { name: 'German', id: 3 }],
                    isDefault: true,
                },
            ],
        });
        doc.merge('direction', { defaultValue: 'vertical' });
        doc.merge('value', { examples: [1, 2, 3] });
    },
    preview: (docPreview: DocPreviewBuilder<uui.RadioGroupProps<any>>) => {
        const TEST_DATA = {
            label: 'Test',
            items: [{ name: 'Test 1', id: 1 }, { name: 'Test 2', id: 2 }],
            value: 1,
        };
        const w170_h70: TPreviewCellSize = '170-70';
        const w100_h70: TPreviewCellSize = '100-70';
        type TMatrixLocal = TPreviewMatrix<uui.RadioGroupProps<any>>;
        const statesBaseMatrix: TMatrixLocal = {
            isInvalid: { values: [false, true] },
            isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
            isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
        };
        docPreview.add({
            id: TRadioGroupPreview['Size Variants'],
            matrix: {
                items: { values: [TEST_DATA.items] },
                value: { values: [TEST_DATA.value] },
                size: { examples: '*' },
                direction: { values: ['vertical', 'horizontal'] },
            },
            cellSize: w170_h70,
        });
        docPreview.add({
            id: TRadioGroupPreview['States'],
            matrix: {
                items: { values: [TEST_DATA.items] },
                value: { values: [TEST_DATA.value] },
                size: { values: ['18'] },
                ...statesBaseMatrix,
            },
            cellSize: w100_h70,
        });
    },
};
