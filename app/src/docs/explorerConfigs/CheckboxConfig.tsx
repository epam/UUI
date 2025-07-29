import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocPreviewBuilder, TDocConfig, TDocContext, TPreviewMatrix, TSkin, TCheckboxPreview } from '@epam/uui-docs';

export const CheckboxConfig: TDocConfig = {
    id: 'checkbox',
    name: 'Checkbox',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Table],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:CheckboxProps', component: uui.Checkbox },
        [TSkin.Loveship]: { type: '@epam/uui:CheckboxProps', component: loveship.Checkbox },
        [TSkin.Promo]: { type: '@epam/uui:CheckboxProps', component: promo.Checkbox },
        [TSkin.Electric]: { type: '@epam/uui:CheckboxProps', component: electric.Checkbox },
    },
    preview: (docPreview: DocPreviewBuilder<uui.CheckboxProps>) => {
        const TEST_DATA = {
            label: 'Test',
        };
        type TMatrixLocal = TPreviewMatrix<uui.CheckboxProps>;
        const statesBaseMatrix: TMatrixLocal = {
            isInvalid: { values: [false, true] },
            isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
            isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
        };
        docPreview.add({
            id: TCheckboxPreview['Size Variants'],
            matrix: [
                {
                    value: { values: [true, false, undefined] },
                    indeterminate: { values: [true], condition: (props) => props.value === undefined },
                    size: { examples: '*' },
                    label: { values: [undefined, TEST_DATA.label] },
                },
            ],
            cellSize: '80-50',
        });
        docPreview.add({
            id: TCheckboxPreview['States'],
            matrix: [
                {
                    value: { values: [true, false] },
                    size: { values: ['18'] },
                    label: { values: [TEST_DATA.label] },
                    ...statesBaseMatrix,
                },
            ],
            cellSize: '100-60',
        });
    },
};
