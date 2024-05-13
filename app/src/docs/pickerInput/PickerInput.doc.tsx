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
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common/docs';
import { renderTogglerExamples } from './pickerInputExamples';
import { TPickerInputPreview } from '../_types/previewIds';
import { euLocationsDs } from './previewTestData';

export class PickerInputDoc extends BaseDocsBlock {
    title = 'Picker Input';

    static override config: TDocConfig = {
        name: 'PickerInput',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Table, TDocContext.Form, TDocContext.OpenedPickerBody],
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
        },
        preview: (docPreview: DocPreviewBuilder<uui.PickerInputProps<any, any>>) => {
            const TEST_DATA = {
                entityName: 'Language',
                placeholder: 'Test',
                icon: 'action-account-fill.svg',
                callback: 'callback',
                dsLanguageLevels: 'Language Levels',
                value: 1,
                valueMulti5: [1, 2, 3, 4, 5],
                valueMulti8: [1, 2, 3, 4, 5, 6, 7, 8],
                valueMulti2: [1, 2],
                euLocationsDs,
                euLocationsLyon: 'lyon',
            };
            const w130_h65: TPreviewCellSize = '130-65';
            const w130_h100: TPreviewCellSize = '130-100';
            const w210_h65: TPreviewCellSize = '210-65';
            const w210_h160: TPreviewCellSize = '210-160';
            const w210_h240: TPreviewCellSize = '210-240';
            const w400_h480: TPreviewCellSize = '400-480';

            const GROUPS = {
                formSingle: 'Form Single',
                formSingleHasValue: 'Form Single HasValue',
                formMulti: 'Form Multi',
                formMultiHasValue: 'Form Multi HasValue',
                formOpened: 'Form Opened',
                //
                inlineSingle: 'Inline Single',
                inlineSingleHasValue: 'Inline Single HasValue',
                inlineMulti: 'Inline Multi',
                inlineMultiHasValue: 'Inline Multi HasValue',
                //
                cellSingle: 'Cell Single',
                cellSingleHasValue: 'Cell Single HasValue',
                cellMulti: 'Cell Multi',
                cellMultiHasValue: 'Cell Multi HasValue',
            };

            type TMatrixLocal = TPreviewMatrix<uui.PickerInputProps<any, any>>;
            const baseMatrix: TMatrixLocal = {
                size: { examples: '*' },
                entityName: { values: [TEST_DATA.entityName] },
                getName: { values: [(i) => i.level] },
                valueType: { values: ['id'] },
                placeholder: { values: [TEST_DATA.placeholder] },
                icon: { examples: [TEST_DATA.icon, undefined] },
                iconPosition: { values: ['left', 'right'], condition: (p) => !!p.icon },
                onIconClick: { examples: [TEST_DATA.callback] },
                disableClear: { values: [false, true] },
                dataSource: { examples: [TEST_DATA.dsLanguageLevels] },
            };
            /**
             * 1.1 Form Single
             */
            const formSingleBaseMatrix: TMatrixLocal = {
                mode: { values: ['form'] },
                selectionMode: { values: ['single'] },
                value: { values: [undefined] },
                isInvalid: { values: [false] },
                isDisabled: { values: [false] },
                isReadonly: { values: [false] },
                ...baseMatrix,
            };
            docPreview.add(GROUPS.formSingle, TPickerInputPreview['Form Single'], formSingleBaseMatrix, w130_h65);
            docPreview.add(GROUPS.formSingle, TPickerInputPreview['Form Single Invalid'], { ...formSingleBaseMatrix, isInvalid: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.formSingle, TPickerInputPreview['Form Single Disabled'], { ...formSingleBaseMatrix, isDisabled: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.formSingle, TPickerInputPreview['Form Single ReadOnly'], { ...formSingleBaseMatrix, isReadonly: { values: [true] } }, w130_h65);
            /**
             * 1.2 Form Single HasValue
             */
            const formSingleHasValueBaseMatrix: TMatrixLocal = { ...formSingleBaseMatrix, value: { values: [TEST_DATA.value] } };
            docPreview.add(GROUPS.formSingleHasValue, TPickerInputPreview['Form Single HasValue'], formSingleHasValueBaseMatrix, w130_h65);
            docPreview.add(GROUPS.formSingleHasValue, TPickerInputPreview['Form Single HasValue Invalid'], { ...formSingleHasValueBaseMatrix, isInvalid: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.formSingleHasValue, TPickerInputPreview['Form Single HasValue Disabled'], { ...formSingleHasValueBaseMatrix, isDisabled: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.formSingleHasValue, TPickerInputPreview['Form Single HasValue ReadOnly'], { ...formSingleHasValueBaseMatrix, isReadonly: { values: [true] } }, w130_h65);
            /**
             * 1.3 Form Multi
             */
            const formMultiBaseMatrix: TMatrixLocal = {
                mode: { values: ['form'] },
                selectionMode: { values: ['multi'] },
                value: { values: [undefined] },
                maxItems: { values: [10] },
                isSingleLine: { values: [false, true] },
                ...baseMatrix,
            };
            docPreview.add(GROUPS.formMulti, TPickerInputPreview['Form Multi'], formMultiBaseMatrix, w130_h100);
            docPreview.add(GROUPS.formMulti, TPickerInputPreview['Form Multi Invalid'], { ...formMultiBaseMatrix, isInvalid: { values: [true] } }, w130_h100);
            docPreview.add(GROUPS.formMulti, TPickerInputPreview['Form Multi Disabled'], { ...formMultiBaseMatrix, isDisabled: { values: [true] } }, w130_h100);
            docPreview.add(GROUPS.formMulti, TPickerInputPreview['Form Multi ReadOnly'], { ...formMultiBaseMatrix, isReadonly: { values: [true] } }, w130_h100);
            /**
             * 1.4 Form Multi HasValue
             */
            const formMultiHasValueBaseMatrix: TMatrixLocal = {
                ...formMultiBaseMatrix,
                value: { values: [TEST_DATA.valueMulti2] },
                isSingleLine: { values: [true] },
            };
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue'], formMultiHasValueBaseMatrix, w210_h65);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Invalid'], { ...formMultiHasValueBaseMatrix, isInvalid: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Disabled'], { ...formMultiHasValueBaseMatrix, isDisabled: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue ReadOnly'], { ...formMultiHasValueBaseMatrix, isReadonly: { values: [true] } }, w210_h65);
            /**
             * 1.5 Form Multi HasValue MultiLine
             */
            const formMultiHasValueMultiLineBaseMatrix: TMatrixLocal = {
                ...formMultiHasValueBaseMatrix,
                isSingleLine: { values: [false] },
                value: { values: [TEST_DATA.valueMulti5] },
            };
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Multiline'], formMultiHasValueMultiLineBaseMatrix, w210_h240);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Multiline Invalid'], { ...formMultiHasValueMultiLineBaseMatrix, isInvalid: { values: [true] } }, w210_h240);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Multiline Disabled'], { ...formMultiHasValueMultiLineBaseMatrix, isDisabled: { values: [true] }, value: { values: [TEST_DATA.valueMulti8] } }, w210_h160);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Multiline ReadOnly'], { ...formMultiHasValueMultiLineBaseMatrix, isReadonly: { values: [true] }, value: { values: [TEST_DATA.valueMulti8] } }, w210_h160);
            /**
             * 1.6 Form Multi HasValue Overflow
             */
            const formMultiHasValueOverflowBaseMatrix: TMatrixLocal = {
                ...formMultiHasValueBaseMatrix,
                isSingleLine: { values: [true] },
                maxItems: { values: [1] },
                value: { values: [TEST_DATA.valueMulti2] },
            };
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Overflow'], formMultiHasValueOverflowBaseMatrix, w210_h65);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Overflow Invalid'], { ...formMultiHasValueOverflowBaseMatrix, isInvalid: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Overflow Disabled'], { ...formMultiHasValueOverflowBaseMatrix, isDisabled: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.formMultiHasValue, TPickerInputPreview['Form Multi HasValue Overflow ReadOnly'], { ...formMultiHasValueOverflowBaseMatrix, isReadonly: { values: [true] } }, w210_h65);

            /**
             * Form Opened Dropdown
             */
            const openedBaseMatrix: TMatrixLocal = {
                mode: { values: ['form'] },
                valueType: { values: ['id'] },
            };
            docPreview.add({
                groupId: GROUPS.formOpened,
                id: TPickerInputPreview['Form Opened Dropdown List'],
                context: TDocContext.OpenedPickerBody,
                cellSize: w400_h480,
                matrix: {
                    ...openedBaseMatrix,
                    getName: { values: [(i) => i.level] },
                    dataSource: { examples: [TEST_DATA.dsLanguageLevels] },
                    selectionMode: { values: ['single'] },
                    value: { values: [undefined, 1] },
                },
            });
            docPreview.add({
                groupId: GROUPS.formOpened,
                id: TPickerInputPreview['Form Opened Dropdown Multi List'],
                context: TDocContext.OpenedPickerBody,
                cellSize: w400_h480,
                matrix: {
                    ...openedBaseMatrix,
                    getName: { values: [(i) => i.level] },
                    dataSource: { examples: [TEST_DATA.dsLanguageLevels] },
                    selectionMode: { values: ['multi'] },
                    value: { values: [undefined, [1]] },
                },
            });
            docPreview.add({
                groupId: GROUPS.formOpened,
                id: TPickerInputPreview['Form Opened Dropdown Tree'],
                context: TDocContext.OpenedPickerBody,
                cellSize: w400_h480,
                matrix: {
                    ...openedBaseMatrix,
                    getName: { values: [(i) => i.name] },
                    dataSource: { values: [TEST_DATA.euLocationsDs] },
                    selectionMode: { values: ['single'] },
                    value: { values: [undefined, TEST_DATA.euLocationsLyon] },
                },
            });
            docPreview.add({
                groupId: GROUPS.formOpened,
                id: TPickerInputPreview['Form Opened Dropdown Multi Tree'],
                context: TDocContext.OpenedPickerBody,
                cellSize: w400_h480,
                matrix: {
                    ...openedBaseMatrix,
                    getName: { values: [(i) => i.name] },
                    dataSource: { values: [TEST_DATA.euLocationsDs] },
                    selectionMode: { values: ['multi'] },
                    value: { values: [undefined, [TEST_DATA.euLocationsLyon]] },
                },
            });

            /**
             * 2.1 Inline Single
             */
            const inlineSingleBaseMatrix: TMatrixLocal = {
                mode: { values: ['inline'] },
                selectionMode: { values: ['single'] },
                value: { values: [undefined] },
                isInvalid: { values: [false] },
                isDisabled: { values: [false] },
                isReadonly: { values: [false] },
                ...baseMatrix,
            };
            docPreview.add(GROUPS.inlineSingle, TPickerInputPreview['Inline Single'], inlineSingleBaseMatrix, w130_h65);
            docPreview.add(GROUPS.inlineSingle, TPickerInputPreview['Inline Single Disabled'], { ...inlineSingleBaseMatrix, isDisabled: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.inlineSingle, TPickerInputPreview['Inline Single ReadOnly'], { ...inlineSingleBaseMatrix, isReadonly: { values: [true] } }, w130_h65);
            /**
             * 2.2 Inline Single HasValue
             */
            const inlineSingleHasValueBaseMatrix: TMatrixLocal = { ...inlineSingleBaseMatrix, value: { values: [TEST_DATA.value] } };
            docPreview.add(GROUPS.inlineSingleHasValue, TPickerInputPreview['Inline Single HasValue'], inlineSingleHasValueBaseMatrix, w130_h65);
            docPreview.add(GROUPS.inlineSingleHasValue, TPickerInputPreview['Inline Single HasValue Disabled'], { ...inlineSingleHasValueBaseMatrix, isDisabled: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.inlineSingleHasValue, TPickerInputPreview['Inline Single HasValue ReadOnly'], { ...inlineSingleHasValueBaseMatrix, isReadonly: { values: [true] } }, w130_h65);
            /**
             * 2.3 Inline Multi
             */
            const inlineMultiBaseMatrix: TMatrixLocal = {
                mode: { values: ['inline'] },
                selectionMode: { values: ['multi'] },
                value: { values: [undefined] },
                maxItems: { values: [10] },
                isSingleLine: { values: [false, true] },
                ...baseMatrix,
            };
            docPreview.add(GROUPS.inlineMulti, TPickerInputPreview['Inline Multi'], inlineMultiBaseMatrix, w130_h100);
            docPreview.add(GROUPS.inlineMulti, TPickerInputPreview['Inline Multi Disabled'], { ...inlineMultiBaseMatrix, isDisabled: { values: [true] } }, w130_h100);
            docPreview.add(GROUPS.inlineMulti, TPickerInputPreview['Inline Multi ReadOnly'], { ...inlineMultiBaseMatrix, isReadonly: { values: [true] } }, w130_h100);
            /**
             * 2.4 Inline Multi HasValue
             */
            const inlineMultiHasValueBaseMatrix: TMatrixLocal = {
                ...inlineMultiBaseMatrix,
                isSingleLine: { values: [true] },
                value: { values: [TEST_DATA.valueMulti2] },
            };
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue'], inlineMultiHasValueBaseMatrix, w210_h65);
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue Disabled'], { ...inlineMultiHasValueBaseMatrix, isDisabled: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue ReadOnly'], { ...inlineMultiHasValueBaseMatrix, isReadonly: { values: [true] } }, w210_h65);
            /**
             * 2.5 Inline Multi HasValue MultiLine
             */
            const inlineMultiHasValueMultiLineBaseMatrix: TMatrixLocal = {
                ...inlineMultiHasValueBaseMatrix,
                isSingleLine: { values: [false] },
                value: { values: [TEST_DATA.valueMulti5] },
            };
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue MultiLine'], inlineMultiHasValueMultiLineBaseMatrix, w210_h240);
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue MultiLine Disabled'], { ...inlineMultiHasValueMultiLineBaseMatrix, isDisabled: { values: [true] }, value: { values: [TEST_DATA.valueMulti8] } }, w210_h160);
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue MultiLine ReadOnly'], { ...inlineMultiHasValueMultiLineBaseMatrix, isReadonly: { values: [true] }, value: { values: [TEST_DATA.valueMulti8] } }, w210_h160);
            /**
             * 2.6 Inline Multi HasValue Overflow
             */
            const inlineMultiHasValueOverflowBaseMatrix: TMatrixLocal = {
                ...inlineMultiHasValueBaseMatrix,
                isSingleLine: { values: [true] },
                maxItems: { values: [1] },
                value: { values: [TEST_DATA.valueMulti2] },
            };
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue Overflow'], inlineMultiHasValueOverflowBaseMatrix, w210_h65);
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue Overflow Disabled'], { ...inlineMultiHasValueOverflowBaseMatrix, isDisabled: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.inlineMultiHasValue, TPickerInputPreview['Inline Multi HasValue Overflow ReadOnly'], { ...inlineMultiHasValueOverflowBaseMatrix, isReadonly: { values: [true] } }, w210_h65);

            /**
             * 3.1 Cell Single
             */
            const cellSingleBaseMatrix: TMatrixLocal = {
                mode: { values: ['cell'] },
                selectionMode: { values: ['single'] },
                value: { values: [undefined] },
                isInvalid: { values: [false] },
                isDisabled: { values: [false] },
                isReadonly: { values: [false] },
                ...baseMatrix,
            };
            docPreview.add(GROUPS.cellSingle, TPickerInputPreview['Cell Single'], cellSingleBaseMatrix, w130_h65);
            docPreview.add(GROUPS.cellSingle, TPickerInputPreview['Cell Single Disabled'], { ...cellSingleBaseMatrix, isDisabled: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.cellSingle, TPickerInputPreview['Cell Single ReadOnly'], { ...cellSingleBaseMatrix, isReadonly: { values: [true] } }, w130_h65);
            /**
             * 3.2 Cell Single HasValue
             */
            const cellSingleHasValueBaseMatrix: TMatrixLocal = { ...cellSingleBaseMatrix, value: { values: [TEST_DATA.value] } };
            docPreview.add(GROUPS.cellSingleHasValue, TPickerInputPreview['Cell Single HasValue'], cellSingleHasValueBaseMatrix, w130_h65);
            docPreview.add(GROUPS.cellSingleHasValue, TPickerInputPreview['Cell Single HasValue Disabled'], { ...cellSingleHasValueBaseMatrix, isDisabled: { values: [true] } }, w130_h65);
            docPreview.add(GROUPS.cellSingleHasValue, TPickerInputPreview['Cell Single HasValue ReadOnly'], { ...cellSingleHasValueBaseMatrix, isReadonly: { values: [true] } }, w130_h65);
            /**
             * 3.3 Cell Multi
             */
            const cellMultiBaseMatrix: TMatrixLocal = {
                mode: { values: ['cell'] },
                selectionMode: { values: ['multi'] },
                value: { values: [undefined] },
                maxItems: { values: [10] },
                isSingleLine: { values: [false, true] },
                ...baseMatrix,
            };
            docPreview.add(GROUPS.cellMulti, TPickerInputPreview['Cell Multi'], cellMultiBaseMatrix, w130_h100);
            docPreview.add(GROUPS.cellMulti, TPickerInputPreview['Cell Multi Disabled'], { ...cellMultiBaseMatrix, isDisabled: { values: [true] } }, w130_h100);
            docPreview.add(GROUPS.cellMulti, TPickerInputPreview['Cell Multi ReadOnly'], { ...cellMultiBaseMatrix, isReadonly: { values: [true] } }, w130_h100);
            /**
             * 3.4 Cell Multi HasValue
             */
            const cellMultiHasValueBaseMatrix: TMatrixLocal = {
                ...cellMultiBaseMatrix,
                isSingleLine: { values: [true] },
                value: { values: [TEST_DATA.valueMulti2] },
            };
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue'], cellMultiHasValueBaseMatrix, w210_h65);
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue Disabled'], { ...cellMultiHasValueBaseMatrix, isDisabled: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue ReadOnly'], { ...cellMultiHasValueBaseMatrix, isReadonly: { values: [true] } }, w210_h65);
            /**
             * 3.5 Cell Multi HasValue MultiLine
             */
            const cellMultiHasValueMultiLineBaseMatrix: TMatrixLocal = {
                ...cellMultiHasValueBaseMatrix,
                isSingleLine: { values: [false] },
                value: { values: [TEST_DATA.valueMulti5] },
            };
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue MultiLine'], cellMultiHasValueMultiLineBaseMatrix, w210_h240);
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue MultiLine Disabled'], { ...cellMultiHasValueMultiLineBaseMatrix, isDisabled: { values: [true] }, value: { values: [TEST_DATA.valueMulti8] } }, w210_h160);
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue MultiLine ReadOnly'], { ...cellMultiHasValueMultiLineBaseMatrix, isReadonly: { values: [true] }, value: { values: [TEST_DATA.valueMulti8] } }, w210_h160);
            /**
             * 3.6 Cell Multi HasValue Overflow
             */
            const cellMultiHasValueOverflowBaseMatrix: TMatrixLocal = {
                ...cellMultiHasValueBaseMatrix,
                isSingleLine: { values: [true] },
                maxItems: { values: [1] },
                value: { values: [TEST_DATA.valueMulti2] },
            };
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue Overflow'], cellMultiHasValueOverflowBaseMatrix, w210_h65);
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue Overflow Disabled'], { ...cellMultiHasValueOverflowBaseMatrix, isDisabled: { values: [true] } }, w210_h65);
            docPreview.add(GROUPS.cellMultiHasValue, TPickerInputPreview['Cell Multi HasValue Overflow ReadOnly'], { ...cellMultiHasValueOverflowBaseMatrix, isReadonly: { values: [true] } }, w210_h65);
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
                <DocExample title="Custom toggler tag render" path="./_examples/pickerInput/PickerTogglerTagDemo.example.tsx" />
            </>
        );
    }
}
