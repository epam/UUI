import { TComponentPreview, TDocContext, TPreviewMatrix } from '../../';
import * as uui from '@epam/uui';
import { euLocationsDs } from './previewTestData';
import { TPickerInputPreview } from '../_types/previewIds';

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
    mode: { values: ['form'] },
    entityName: { values: [TEST_DATA.entityName] },
    getName: { values: [(i) => i.level] },
    valueType: { values: ['id'] },
    placeholder: { values: [TEST_DATA.placeholder] },
    onIconClick: { examples: [TEST_DATA.callback] },
    dataSource: { examples: [TEST_DATA.dsLanguageLevels] },
};
const getMultiSelectMatrix = (): TMatrixLocal => {
    const baseLocal: TMatrixLocal = {
        selectionMode: { values: ['multi'] },
        value: { values: [undefined, TEST_DATA.valueMulti2] },
        maxItems: {
            values: [10, 1],
            condition: (props, v) => {
                return v === 1 ? !!props.value : true;
            },
        },
        isSingleLine: { values: [true] },
        icon: { examples: [TEST_DATA.icon, undefined] },
        iconPosition: { values: ['left', 'right'], condition: (p) => !!p.icon },
        ...disableClearBaseMatrix,
    };
    return { size: { examples: '*' }, ...baseLocal, ...baseMatrix };
};
const getMultiSelectMultiLineMatrix = (): TMatrixLocal => {
    return {
        ...baseMatrix,
        size: { examples: '*' },
        selectionMode: { values: ['multi'] },
        value: {
            values: [TEST_DATA.valueMulti3, TEST_DATA.valueMulti5, TEST_DATA.valueMulti8],
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
        icon: { examples: [TEST_DATA.icon, undefined] },
        iconPosition: { values: ['right'], condition: (p) => !!p.icon },
    };
};

export const previews: TComponentPreview<uui.PickerInputProps<any, any>>[] = [
    {
        id: TPickerInputPreview['Sizes single'],
        matrix: {
            ...disableClearBaseMatrix,
            ...baseMatrix,
            size: { examples: '*' },
            selectionMode: { values: ['single'] },
            value: { values: [undefined, TEST_DATA.value] },
            icon: { examples: [TEST_DATA.icon, undefined] },
            iconPosition: { values: ['right', 'left'], condition: (p) => !!p.icon },
        },
        cellSize: '140-60',
    },
    { id: TPickerInputPreview['Sizes multi'], matrix: getMultiSelectMatrix(), cellSize: '240-60' },
    { id: TPickerInputPreview['Sizes multi multiline'], matrix: getMultiSelectMultiLineMatrix(), cellSize: '240-140' },
    {
        id: TPickerInputPreview['Modes + States'],
        cellSize: '200-90',
        matrix: [
            {
                ...baseMatrix,
                ...statesBaseMatrix,
                size: { values: ['36'] },
                selectionMode: { values: ['single'] },
                mode: { values: ['form', 'cell', 'inline'] },
                value: { values: [undefined, TEST_DATA.value] },
                icon: { examples: [TEST_DATA.icon] },
                iconPosition: { values: ['left'] },
            },
            {
                ...baseMatrix,
                ...statesBaseMatrix,
                size: { values: ['36'] },
                selectionMode: { values: ['multi'] },
                mode: { values: ['form', 'cell', 'inline'] },
                value: { values: [undefined, TEST_DATA.valueMulti2] },
                icon: { examples: [TEST_DATA.icon] },
                iconPosition: { values: ['left'] },
            },
        ],
    },
    {
        id: TPickerInputPreview['Opened single'],
        context: TDocContext.OpenedPickerBody,
        cellSize: '400-480',
        matrix: [
            {
                ...baseMatrix,
                getName: { values: [(i) => i.level] },
                dataSource: { examples: [TEST_DATA.dsLanguageLevels] },
                selectionMode: { values: ['single'] },
                value: { values: [undefined, 1] },
            },
            {
                ...baseMatrix,
                getName: { values: [(i) => i.name] },
                dataSource: { values: [TEST_DATA.euLocationsDs] },
                selectionMode: { values: ['single'] },
                value: { values: [TEST_DATA.euLocationsLyon] },
            },
        ],
    },
    {
        id: TPickerInputPreview['Opened multi'],
        context: TDocContext.OpenedPickerBody,
        cellSize: '400-480',
        matrix: [
            {
                ...baseMatrix,
                getName: { values: [(i) => i.level] },
                dataSource: { examples: [TEST_DATA.dsLanguageLevels] },
                selectionMode: { values: ['multi'] },
                value: { values: [undefined, [1]] },
            },
            {
                ...baseMatrix,
                getName: { values: [(i) => i.name] },
                dataSource: { values: [TEST_DATA.euLocationsDs] },
                selectionMode: { values: ['multi'] },
                value: { values: [[TEST_DATA.euLocationsLyon]] },
            },
        ],
    },
];
