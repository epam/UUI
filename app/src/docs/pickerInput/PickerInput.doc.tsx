import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common/docs';
import { renderTagExamples, renderTogglerExamples } from './pickerInputExamples';
import { previews } from './previews';

export class PickerInputDoc extends BaseDocsBlock {
    title = 'Picker Input';

    static override config: TDocConfig = {
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
            doc.merge('getRowOptions', { examples: [{ name: 'Disabled rows', value: () => ({ isDisabled: true, isSelectable: false }) }] });
            doc.merge('size', { defaultValue: '36' });
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

    renderContent(): React.ReactNode {
        return (
            <>
                <EditableDocContent fileName="pickerInput-descriptions" />
                { this.renderSectionTitle('Examples') }
                <DocExample title="Basic" path="./_examples/pickerInput/ArrayPickerInput.example.tsx" />
                <DocExample title="Lazy list" path="./_examples/pickerInput/LazyPickerInput.example.tsx" />
                <DocExample title="Lazy tree" path="./_examples/pickerInput/LazyTreeInput.example.tsx" />
                <DocExample title="Async list" path="./_examples/pickerInput/AsyncPickerInput.example.tsx" />
                <DocExample title="Cascade selection modes" path="./_examples/pickerInput/CascadeSelectionModes.example.tsx" />
                <DocExample title="Custom picker row" path="./_examples/pickerInput/CustomUserRow.example.tsx" />
                <DocExample title="Custom picker footer" path="./_examples/pickerInput/PickerInputWithCustomFooter.example.tsx" />
                <DocExample title="Picker toggler configuration and options" path="./_examples/pickerInput/TogglerConfiguration.example.tsx" />
                <DocExample title="Setting row options" path="./_examples/pickerInput/GetRowOptions.example.tsx" />
                <DocExample title="Getting selected entity" path="./_examples/pickerInput/ValueType.example.tsx" />
                <DocExample title="Search positions" path="./_examples/pickerInput/SearchPositions.example.tsx" />
                <DocExample title="Flatten search results mode" path="./_examples/pickerInput/LazyTreeSearch.example.tsx" />
                <DocExample title="Turn off 'Select All' button in footer" path="./_examples/pickerInput/PickerInputTurnOffSelectAll.example.tsx" />
                <DocExample title="Open picker in modal" path="./_examples/pickerInput/EditMode.example.tsx" />
                <DocExample title="Picker with changed array of items" path="./_examples/pickerInput/PickerWithChangingItemsArray.example.tsx" />
                <DocExample title="Linked pickers" path="./_examples/pickerInput/LinkedPickers.example.tsx" />
                <DocExample title="Change portal target and dropdown placement" path="./_examples/pickerInput/ConfigurePortalTargetAndPlacement.example.tsx" />
                <DocExample title="Custom toggler tag render" path="./_examples/pickerInput/CustomPickerTogglerTag.example.tsx" />
            </>
        );
    }
}
