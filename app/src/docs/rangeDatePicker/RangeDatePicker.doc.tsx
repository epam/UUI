import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../../common';
import { DocBuilder } from '@epam/uui-docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as promoDocs from './../_props/epam-promo/docs';
import * as loveshipDocs from './../_props/loveship/docs';
import { TDocConfig } from '../../common/docs/docBuilderGen/types';
import {
    filterExamples,
    getPlaceholderExamples,
    presetsExamples,
    renderDayExamples,
    renderFooterExamples,
} from './rangeDatePickerExamples';

export class RangeDatePickerDoc extends BaseDocsBlock {
    title = 'RangeDatePicker';

    override config: TDocConfig = {
        name: 'RangeDatePicker',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RangeDatePickerProps', component: uui.RangeDatePicker },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:RangeDatePickerProps',
                component: loveship.RangeDatePicker,
                doc: (doc: DocBuilder<uui.RangeDatePickerProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:RangeDatePickerProps',
                component: promo.RangeDatePicker,
                doc: (doc: DocBuilder<uui.RangeDatePickerProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<uui.RangeDatePickerProps>) => {
            doc.merge('value', {
                examples: [{ name: "{ from: '2017-01-22', to: '2017-01-28' }", value: { from: '2017-01-22', to: '2017-01-28' } }],
            });
            doc.merge('format', {
                examples: ['MM/DD/YYYY', 'MMM D, YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD'],
                defaultValue: 'MMM D, YYYY',
                type: 'string',
            });
            doc.merge('renderDay', { examples: renderDayExamples });
            doc.merge('renderFooter', { examples: renderFooterExamples });
            doc.merge('presets', { examples: presetsExamples });
            doc.merge('getPlaceholder', { examples: getPlaceholderExamples });
            doc.merge('filter', { examples: filterExamples });
            doc.merge('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="rangeDatePicker-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/rangeDatePicker/Basic.example.tsx" />

                <DocExample title="Presets and Footer" path="./_examples/rangeDatePicker/PresetsAndFooter.example.tsx" />

                {this.renderSectionTitle('Localization')}
                <EditableDocContent fileName="datePicker-localization" />
            </>
        );
    }
}
