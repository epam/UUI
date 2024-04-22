import { dayJsHelper } from '../../helpers';
import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { renderCustomDayExample, renderFooter } from './datePickerExamples';

export class DatePickerDoc extends BaseDocsBlock {
    title = 'DatePicker';

    static override config: TDocConfig = {
        name: 'DatePicker',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable, TDocContext.Table],
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
            doc.merge('filter', { examples: [{ name: 'Filter before current day', value: (day) => day.valueOf() >= dayJsHelper.dayjs().subtract(1, 'day').valueOf() }] });
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
