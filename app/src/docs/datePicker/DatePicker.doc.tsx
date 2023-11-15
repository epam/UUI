import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../../common';
import { DocBuilder } from '@epam/uui-docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as promoDocs from '../_props/epam-promo/docs';
import * as loveshipDocs from '../_props/loveship/docs';
import { TDocConfig } from '../../common/docs/docBuilderGen/types';
import { renderCustomDayExample, renderFooter } from './datePickerExamples';
import dayjs from 'dayjs';

export class DatePickerDoc extends BaseDocsBlock {
    title = 'DatePicker';

    override config: TDocConfig = {
        name: 'DatePicker',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:DatePickerProps', component: uui.DatePicker },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:DatePickerProps',
                component: loveship.DatePicker,
                doc: (doc: DocBuilder<uui.DatePickerProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:DatePickerProps',
                component: promo.DatePicker,
                doc: (doc: DocBuilder<uui.DatePickerProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext, promoDocs.TableContext),
            },
        },
        doc: (doc: DocBuilder<uui.DatePickerProps>) => {
            doc.merge('size', { defaultValue: '36' });
            doc.merge('format', {
                examples: [
                    'MM/DD/YYYY', 'MMM D, YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD',
                ],
                defaultValue: 'MMM D, YYYY',
                type: 'string',
            });
            doc.merge('disableClear', { defaultValue: false });
            doc.merge('value', { examples: ['', '2020-09-03'] });
            doc.merge('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] });
            doc.merge('renderDay', {
                examples: renderCustomDayExample,
            });
            doc.merge('renderFooter', {
                examples: renderFooter,
            });
            doc.merge('filter', {
                examples: [
                    {
                        name: 'Filter before current day',
                        value: (day) => day.valueOf() >= dayjs().subtract(1, 'day').valueOf(),
                    },
                ],
            });
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
