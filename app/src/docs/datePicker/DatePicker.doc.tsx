import { uuiDayjs } from '../../helpers';
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
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { renderCustomDayExample, renderFooter } from './datePickerExamples';
import { TDatePickerPreview } from '../_types/previewIds';

export class DatePickerDoc extends BaseDocsBlock {
    title = 'DatePicker';

    static override config: TDocConfig = {
        name: 'DatePicker',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable, TDocContext.Table, TDocContext.OpenedPickerBody],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:DatePickerProps', component: uui.DatePicker },
            [TSkin.Loveship]: { type: '@epam/uui:DatePickerProps', component: loveship.DatePicker },
            [TSkin.Promo]: { type: '@epam/uui:DatePickerProps', component: promo.DatePicker },
            [TSkin.Electric]: { type: '@epam/uui:DatePickerProps', component: electric.DatePicker },
        },
        doc: (doc: DocBuilder<uui.DatePickerProps>) => {
            doc.merge('size', { defaultValue: '36' });
            doc.merge('format', { examples: ['MM/DD/YYYY', 'MMM D, YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD'], defaultValue: 'MMM D, YYYY', editorType: 'StringWithExamplesEditor' });
            doc.merge('value', { examples: ['', '2020-09-03'] });
            doc.merge('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] });
            doc.merge('renderDay', { examples: renderCustomDayExample });
            doc.merge('renderFooter', { examples: renderFooter });
            doc.merge('filter', { examples: [{ name: 'Filter before current day', value: (day) => day.valueOf() >= uuiDayjs.dayjs().subtract(1, 'day').valueOf() }] });
        },
        preview: (docPreview: DocPreviewBuilder<uui.DatePickerProps>) => {
            const TEST_DATA = {
                value: '2345-11-25',
            };
            type TMatrixLocal = TPreviewMatrix<uui.DatePickerProps>;
            const baseMatrix: TMatrixLocal = {
                isInvalid: { values: [false, true] },
                value: { values: [undefined, TEST_DATA.value] },
                size: { examples: '*' },
                iconPosition: { examples: '*' },
                disableClear: { values: [true, false] },
            };
            const cellSize: TPreviewCellSize = '180-60';
            const openedCellSize: TPreviewCellSize = '320-400';
            /**
             * Form
             */
            const baseFormMatrix: TMatrixLocal = { ...baseMatrix, mode: { values: ['form'] } };
            docPreview.add(TDatePickerPreview.Form, baseFormMatrix, cellSize);
            docPreview.add({
                id: TDatePickerPreview['Form Open'],
                matrix: { value: { values: [TEST_DATA.value] } },
                cellSize: openedCellSize,
                context: TDocContext.OpenedPickerBody,
            });
            docPreview.add(TDatePickerPreview['Form Disabled'], { ...baseFormMatrix, isDisabled: { values: [true] }, isInvalid: { values: [false] } }, cellSize);
            docPreview.add(TDatePickerPreview['Form ReadOnly'], { ...baseFormMatrix, isReadonly: { values: [true] }, isInvalid: { values: [false] } }, cellSize);
            /**
             * Inline
             */
            const baseInlineMatrix: TMatrixLocal = { ...baseMatrix, mode: { values: ['inline'] } };
            docPreview.add(TDatePickerPreview.Inline, baseInlineMatrix, cellSize);
            docPreview.add(TDatePickerPreview['Inline Disabled'], { ...baseInlineMatrix, isDisabled: { values: [true] }, isInvalid: { values: [false] } }, cellSize);
            docPreview.add(TDatePickerPreview['Inline ReadOnly'], { ...baseInlineMatrix, isReadonly: { values: [true] }, isInvalid: { values: [false] } }, cellSize);
            /**
             * Cell
             */
            const baseCellMatrix: TMatrixLocal = { ...baseMatrix, mode: { values: ['cell'] } };
            docPreview.add(TDatePickerPreview.Cell, baseCellMatrix, cellSize);
            docPreview.add(TDatePickerPreview['Cell Disabled'], { ...baseCellMatrix, isDisabled: { values: [true] }, isInvalid: { values: [false] } }, cellSize);
            docPreview.add(TDatePickerPreview['Cell ReadOnly'], { ...baseCellMatrix, isReadonly: { values: [true] }, isInvalid: { values: [false] } }, cellSize);
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="datePicker-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/datePicker/Basic.example.tsx" />

                <DocExample title="Format date" path="./_examples/datePicker/FormatDate.example.tsx" />

                <DocExample title="Render footer" path="./_examples/datePicker/Footer.example.tsx" />

                <DocExample title="Disable dates" path="./_examples/datePicker/Filter.example.tsx" />

                <DocExample title="Customize day render" path="./_examples/datePicker/CustomRenderDay.example.tsx" />
                {this.renderSectionTitle('Localization')}
                <EditableDocContent fileName="datePicker-localization" />
            </>
        );
    }
}
