import { uuiDayjs } from '../../helpers';
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
} from '../../';
import { renderCustomDayExample, renderFooter } from './datePickerExamples';
import { TDatePickerPreview } from '../_types/previewIds';
import { DocItem } from '../_types/docItem';

export const datePickerExplorerConfig: TDocConfig = {
    name: 'DatePicker',
    contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable, TDocContext.Table],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:DatePickerProps', component: uui.DatePicker },
        [TSkin.Loveship]: { type: '@epam/uui:DatePickerProps', component: loveship.DatePicker },
        [TSkin.Promo]: { type: '@epam/uui:DatePickerProps', component: promo.DatePicker },
        [TSkin.Electric]: { type: '@epam/uui:DatePickerProps', component: electric.DatePicker },
    },
    doc: (doc: DocBuilder<uui.DatePickerProps>) => {
        doc.merge('format', { examples: ['MM/DD/YYYY', 'MMM D, YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD'], defaultValue: 'MMM D, YYYY', editorType: 'StringWithExamplesEditor' });
        doc.merge('value', { examples: ['', '2020-09-03'] });
        doc.merge('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] });
        doc.merge('renderDay', { examples: renderCustomDayExample });
        doc.merge('renderFooter', { examples: renderFooter });
        doc.merge('filter', { examples: [{ name: 'Filter before current day', value: (day: any) => day.valueOf() >= uuiDayjs.dayjs().subtract(1, 'day').valueOf() }] });
    },
    preview: (docPreview: DocPreviewBuilder<uui.DatePickerProps>) => {
        const TEST_DATA = {
            value: '2345-11-25',
        };
        type TMatrixLocal = TPreviewMatrix<uui.DatePickerProps>;
        const baseMatrix: TMatrixLocal = {
            value: { values: [undefined, TEST_DATA.value] },
            size: { examples: '*' },
        };
        const statesBaseMatrix: TMatrixLocal = {
            size: { values: ['30'] },
            isInvalid: { values: [false, true] },
            isDisabled: { values: [false, true], condition: (props: uui.DatePickerProps) => !props.isInvalid },
            isReadonly: { values: [false, true], condition: (props: uui.DatePickerProps) => !props.isInvalid && !props.isDisabled },
        };
        const w180_h60: TPreviewCellSize = '180-60';
        const w320_h400: TPreviewCellSize = '320-400';

        docPreview.add(TDatePickerPreview['Size Variants'], {
            mode: { values: ['form'] },
            disableClear: { values: [true, false] },
            iconPosition: { examples: '*' },
            ...baseMatrix,
        }, w180_h60);

        docPreview.add(TDatePickerPreview['States'], { mode: { values: ['form', 'inline', 'cell'] }, ...baseMatrix, ...statesBaseMatrix }, w180_h60);

        docPreview.add({
            id: TDatePickerPreview.Opened,
            matrix: { value: { values: [TEST_DATA.value] } },
            cellSize: w320_h400,
        });
    },
};

export const DatePickerDocItem: DocItem = {
    id: 'datePicker',
    name: 'Date Picker',
    parentId: 'components',
    examples: [
        { descriptionPath: 'datePicker-descriptions' },
        { name: 'Basic', componentPath: './_examples/datePicker/Basic.example.tsx' },
        { name: 'Format date', componentPath: './_examples/datePicker/FormatDate.example.tsx' },
        { name: 'Render footer', componentPath: './_examples/datePicker/Footer.example.tsx' },
        { name: 'Disable dates', componentPath: './_examples/datePicker/Filter.example.tsx' },
        { name: 'Prevent from being empty', componentPath: './_examples/datePicker/PreventEmpty.example.tsx' },
        { name: 'Customize day render', componentPath: './_examples/datePicker/CustomRenderDay.example.tsx' },
    ],
    explorerConfig: datePickerExplorerConfig,
};
