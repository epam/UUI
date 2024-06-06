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
import {
    filterExamples,
    getPlaceholderExamples,
    presetsExamples,
    renderDayExamples,
    renderFooterExamples,
} from './rangeDatePickerExamples';
import { TRangeDatePickerPreview } from '../_types/previewIds';

export class RangeDatePickerDoc extends BaseDocsBlock {
    title = 'RangeDatePicker';

    static override config: TDocConfig = {
        name: 'RangeDatePicker',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RangeDatePickerProps', component: uui.RangeDatePicker },
            [TSkin.Electric]: { type: '@epam/uui:RangeDatePickerProps', component: electric.RangeDatePicker },
            [TSkin.Loveship]: { type: '@epam/uui:RangeDatePickerProps', component: loveship.RangeDatePicker },
            [TSkin.Promo]: { type: '@epam/uui:RangeDatePickerProps', component: promo.RangeDatePicker },
        },
        doc: (doc: DocBuilder<uui.RangeDatePickerProps>) => {
            doc.merge('value', {
                examples: [{ name: "{ from: '2017-01-22', to: '2017-01-28' }", value: { from: '2017-01-22', to: '2017-01-28' } }],
            });
            doc.merge('format', {
                examples: ['MM/DD/YYYY', 'MMM D, YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD'],
                defaultValue: 'MMM D, YYYY',
                editorType: 'StringWithExamplesEditor',
            });
            doc.merge('renderDay', { examples: renderDayExamples });
            doc.merge('renderFooter', { examples: renderFooterExamples });
            doc.merge('presets', { examples: presetsExamples() });
            doc.merge('getPlaceholder', { examples: getPlaceholderExamples });
            doc.merge('filter', { examples: filterExamples });
            doc.merge('isHoliday', { examples: [{ name: 'without Holidays', value: () => false }] });
            doc.merge('rawProps', {
                editorType: 'JsonEditor',
                examples: [
                    {
                        name: 'from & to & body',
                        value: {
                            from: { style: { border: '3px solid green' } },
                            to: { style: { border: '3px solid orange' } },
                            body: { style: { border: '3px solid blue' } },
                        },
                    },
                ],
            });
        },

        preview: (docPreview: DocPreviewBuilder<uui.RangeDatePickerProps>) => {
            const TEST_DATA = {
                value: { from: '2345-10-15', to: '2345-11-25' },
            };
            const w320_h60: TPreviewCellSize = '320-60';
            const w768_h500: TPreviewCellSize = '768-500';
            type TMatrixLocal = TPreviewMatrix<uui.RangeDatePickerProps>;
            const statesBaseMatrix: TMatrixLocal = {
                size: { values: ['30'] },
                isInvalid: { values: [false, true] },
                isDisabled: { values: [false, true], condition: (props) => !props.isInvalid },
                isReadonly: { values: [false, true], condition: (props) => !props.isInvalid && !props.isDisabled },
            };
            const baseMatrix: TMatrixLocal = {
                size: { examples: '*' },
                value: { values: [undefined, TEST_DATA.value] },
                disableClear: { values: [true, false], condition: (props) => !!props.value },
            };
            docPreview.add(TRangeDatePickerPreview['Size Variants'], { ...baseMatrix }, w320_h60);
            docPreview.add(TRangeDatePickerPreview['Color Variants'], { ...baseMatrix, ...statesBaseMatrix }, w320_h60);
            docPreview.add(TRangeDatePickerPreview.Opened, { value: { values: [TEST_DATA.value] } }, w768_h500);
            docPreview.add(TRangeDatePickerPreview['Opened With Presets'], { value: { values: [TEST_DATA.value] }, presets: { examples: ['default'] } }, w768_h500);
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
