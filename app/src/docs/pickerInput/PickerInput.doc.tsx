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
            enum GROUPS {
                FORM = 'Form',
                FORM_OPENED = 'Form Opened',
                CELL = 'Cell',
                INLINE = 'Inline'
            }
            const TEST_DATA = {
                entityName: 'Language',
                placeholder: 'Test',
                icon: 'action-account-fill.svg',
                callback: 'callback',
                dsLanguageLevels: 'Language Levels',
                value: 1,
                valueMulti3: [1, 2, 3],
                valueMulti5: [1, 2, 3, 4, 5],
                valueMulti8: [1, 2, 3, 4, 5, 6, 7, 8],
                valueMulti2: [1, 2],
                euLocationsDs,
                euLocationsLyon: 'lyon',
            };
            const w130_h60: TPreviewCellSize = '130-60';
            const w240_h65: TPreviewCellSize = '240-65';
            const w240_h50: TPreviewCellSize = '240-50';
            const w240_h120: TPreviewCellSize = '240-120';
            const w400_h480: TPreviewCellSize = '400-480';

            type TMode = uui.PickerInputProps<any, any>['mode'];
            type TMatrixLocal = TPreviewMatrix<uui.PickerInputProps<any, any>>;

            const statesBaseMatrix: TMatrixLocal = {
                isInvalid: { values: [false, true] },
                isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
                isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
            };
            const disableClearBaseMatrix: TMatrixLocal = {
                disableClear: { values: [false, true], condition: (props) => props.value !== undefined },
            };
            const baseMatrix: TMatrixLocal = {
                entityName: { values: [TEST_DATA.entityName] },
                getName: { values: [(i) => i.level] },
                valueType: { values: ['id'] },
                placeholder: { values: [TEST_DATA.placeholder] },
                icon: { examples: [TEST_DATA.icon, undefined] },
                iconPosition: { values: ['left', 'right'], condition: (p) => !!p.icon },
                onIconClick: { examples: [TEST_DATA.callback] },
                dataSource: { examples: [TEST_DATA.dsLanguageLevels] },
            };

            const getSingleSelectMatrix = (mode: TMode, states: boolean = false): TMatrixLocal => {
                const baseLocal: TMatrixLocal = {
                    mode: { values: [mode] },
                    selectionMode: { values: ['single'] },
                    value: { values: [undefined, TEST_DATA.value] },
                    ...disableClearBaseMatrix,
                };
                if (states) {
                    return { size: { values: ['36'] }, ...baseLocal, ...baseMatrix, ...statesBaseMatrix };
                }
                return { size: { examples: '*' }, ...baseLocal, ...baseMatrix };
            };
            const getMultiSelectMatrix = (mode: TMode, states: boolean = false): TMatrixLocal => {
                const baseLocal: TMatrixLocal = {
                    mode: { values: [mode] },
                    selectionMode: { values: ['multi'] },
                    value: { values: [undefined, TEST_DATA.valueMulti2] },
                    maxItems: {
                        values: [10, 1],
                        condition: (props, v) => {
                            return v === 1 ? !!props.value : true;
                        },
                    },
                    isSingleLine: { values: [true] },
                    ...disableClearBaseMatrix,
                };
                if (states) {
                    return { size: { values: ['36'] }, ...baseLocal, ...baseMatrix, ...statesBaseMatrix };
                }
                return { size: { examples: '*' }, ...baseLocal, ...baseMatrix };
            };
            const getMultiSelectMultiLineMatrix = (mode: TMode, states: boolean = false): TMatrixLocal => {
                const baseLocal: TMatrixLocal = {
                    mode: { values: [mode] },
                    selectionMode: { values: ['multi'] },
                    value: {
                        values: [undefined, TEST_DATA.valueMulti3, TEST_DATA.valueMulti5, TEST_DATA.valueMulti8],
                        condition: (props, v) => {
                            if (v) {
                                const sizeAsNumber = Number(props.size);
                                if (!isNaN(sizeAsNumber)) {
                                    if (sizeAsNumber >= 48) {
                                        return v === TEST_DATA.valueMulti3;
                                    } else if (sizeAsNumber >= 36) {
                                        return v === TEST_DATA.valueMulti5;
                                    }
                                }
                                return v === TEST_DATA.valueMulti8;
                            }
                            return true;
                        },
                    },
                    maxItems: { values: [10] },
                    isSingleLine: { values: [false] },
                    ...disableClearBaseMatrix,
                };

                if (states) {
                    return { size: { values: ['24'] }, ...baseLocal, ...baseMatrix, ...statesBaseMatrix };
                }
                return { size: { examples: '*' }, ...baseLocal, ...baseMatrix };
            };

            // FORM
            docPreview.add(GROUPS.FORM, TPickerInputPreview['Form SingleSelect'], getSingleSelectMatrix('form'), w130_h60);
            docPreview.add(GROUPS.FORM, TPickerInputPreview['Form SingleSelect States'], getSingleSelectMatrix('form', true), w240_h50);
            docPreview.add(GROUPS.FORM, TPickerInputPreview['Form MultiSelect'], getMultiSelectMatrix('form'), w240_h65);
            docPreview.add(GROUPS.FORM, TPickerInputPreview['Form MultiSelect States'], getMultiSelectMatrix('form', true), w240_h50);
            docPreview.add(GROUPS.FORM, TPickerInputPreview['Form MultiSelect Multiline'], getMultiSelectMultiLineMatrix('form'), w240_h120);
            docPreview.add(GROUPS.FORM, TPickerInputPreview['Form MultiSelect Multiline States'], getMultiSelectMultiLineMatrix('form', true), w240_h65);
            // INLINE
            docPreview.add(GROUPS.INLINE, TPickerInputPreview['Inline SingleSelect'], getSingleSelectMatrix('inline'), w130_h60);
            docPreview.add(GROUPS.INLINE, TPickerInputPreview['Inline SingleSelect States'], getSingleSelectMatrix('inline', true), w240_h50);
            docPreview.add(GROUPS.INLINE, TPickerInputPreview['Inline MultiSelect'], getMultiSelectMatrix('inline'), w240_h65);
            docPreview.add(GROUPS.INLINE, TPickerInputPreview['Inline MultiSelect States'], getMultiSelectMatrix('inline', true), w240_h50);
            docPreview.add(GROUPS.INLINE, TPickerInputPreview['Inline MultiSelect Multiline'], getMultiSelectMultiLineMatrix('inline'), w240_h120);
            docPreview.add(GROUPS.INLINE, TPickerInputPreview['Inline MultiSelect Multiline States'], getMultiSelectMultiLineMatrix('inline', true), w240_h65);
            // CELL
            docPreview.add(GROUPS.CELL, TPickerInputPreview['Cell SingleSelect'], getSingleSelectMatrix('cell'), w130_h60);
            docPreview.add(GROUPS.CELL, TPickerInputPreview['Cell SingleSelect States'], getSingleSelectMatrix('cell', true), w240_h50);
            docPreview.add(GROUPS.CELL, TPickerInputPreview['Cell MultiSelect'], getMultiSelectMatrix('cell'), w240_h65);
            docPreview.add(GROUPS.CELL, TPickerInputPreview['Cell MultiSelect States'], getMultiSelectMatrix('cell', true), w240_h50);
            docPreview.add(GROUPS.CELL, TPickerInputPreview['Cell MultiSelect Multiline'], getMultiSelectMultiLineMatrix('cell'), w240_h120);
            docPreview.add(GROUPS.CELL, TPickerInputPreview['Cell MultiSelect Multiline States'], getMultiSelectMultiLineMatrix('cell', true), w240_h65);

            /**
             * Form Opened Dropdown
             */
            const openedBaseMatrix: TMatrixLocal = {
                mode: { values: ['form'] },
                valueType: { values: ['id'] },
            };
            docPreview.add({
                groupId: GROUPS.FORM_OPENED,
                id: TPickerInputPreview['Form Opened SingleSelect'],
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
                groupId: GROUPS.FORM_OPENED,
                id: TPickerInputPreview['Form Opened MultiSelect'],
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
                groupId: GROUPS.FORM_OPENED,
                id: TPickerInputPreview['Form Opened SingleSelect Tree'],
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
                groupId: GROUPS.FORM_OPENED,
                id: TPickerInputPreview['Form Opened MultiSelect Tree'],
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
