import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { renderTagExamples, renderTogglerExamples } from './pickerInputExamples';
import { previews } from './previews';
import { TDocConfig, TDocContext, TSkin, DocBuilder, DocPreviewBuilder } from '@epam/uui-docs';

export const PickerInputConfig: TDocConfig = {
    id: 'pickerInput',
    name: 'PickerInput',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Table, TDocContext.Form],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:PickerInputProps', component: uui.PickerInput },
        [TSkin.Electric]: { type: '@epam/uui:PickerInputProps', component: electric.PickerInput },
        [TSkin.Loveship]: { type: '@epam/uui:PickerInputProps', component: loveship.PickerInput },
        [TSkin.Promo]: { type: '@epam/uui:PickerInputProps', component: promo.PickerInput },
    },
    doc: (doc: DocBuilder<uui.PickerInputProps<any, any>>) => {
        doc.merge('renderToggler', { examples: renderTogglerExamples });
        doc.merge('getRowOptions', { examples: [
            { name: 'Disabled rows', value: () => ({ isDisabled: true, isSelectable: false }) },
            { name: 'Disabled checkboxes', value: () => ({ isDisabled: true, checkbox: { isVisible: true, isDisabled: true } }) },
        ],
        });
        doc.setDefaultPropExample('valueType', (e) => {
            return e.value === 'id';
        });
        doc.merge('editMode', { defaultValue: 'dropdown' });
        doc.merge('minCharsToSearch', { examples: [0, 1, 3, 5] });
        doc.merge('maxItems', { examples: [0, 1, 5, 10, 50, 100, 1000] });
        doc.merge('isFoldedByDefault', { examples: [{ value: () => false, name: '(item) => false' }] });
        doc.merge('disableClear', { defaultValue: false });
        doc.merge('dropdownHeight', { defaultValue: 300, examples: [100, 200, 300] });
        doc.merge('minBodyWidth', { defaultValue: 360, examples: [100, 150, 200, 250, 300, 360, 400] });
        doc.merge('iconPosition', { defaultValue: 'left' });
        doc.merge('rawProps', {
            editorType: 'JsonEditor',
            examples: [
                {
                    name: 'input & body',
                    value: {
                        input: { style: { border: '3px solid green' } },
                        body: { style: { border: '3px solid blue' } },
                    },
                },
            ],
        });
        doc.merge('value', {
            examples: [
                { name: 'undefined', value: undefined }, { name: '1', value: 1 }, { name: '[1, 2]', value: [1, 2] }, { name: '{ id: 1, name: "Test"}', value: { id: 1, name: 'Test' } }, { name: '[{ id: 1, name: "Test"}]', value: [{ id: 1, name: 'Test' }] },
            ],
        });
        doc.merge('filter', {
            examples: [{ name: "{ country: 'UK' }", value: { country: 'UK' } }],
            remountOnChange: true,
        });
        doc.merge('renderTag', { examples: renderTagExamples });
    },
    preview: (docPreview: DocPreviewBuilder<uui.PickerInputProps<any, any>>) => {
        previews.map((i) => docPreview.add(i));
    },
};
