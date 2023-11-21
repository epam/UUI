import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import {
    BaseDocsBlock, DocExample, EditableDocContent,
} from '../common';

export class TimePickerDoc extends BaseDocsBlock {
    title = 'TimePicker';

    override config: TDocConfig = {
        name: 'TimePicker',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form, TDocContext.Table],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TimePickerProps', component: uui.TimePicker },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:TimePickerProps', component: loveship.TimePicker },
            [TSkin.UUI4_promo]: { type: '@epam/uui:TimePickerProps', component: promo.TimePicker },
        },
        doc: (doc: DocBuilder<uui.TimePickerProps>) => {
            doc.merge('size', { defaultValue: '36' });
            doc.merge('mode', { defaultValue: 'form' });
            doc.merge('value', {
                examples: [
                    { name: '{ hours: 6, minutes: 20 }', value: { hours: 6, minutes: 20 }, isDefault: true },
                    { name: 'undefined', value: undefined },
                ],
            });
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
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="timePicker-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/timePicker/Basic.example.tsx" />

                <DocExample title=" 24-hour format" path="./_examples/timePicker/TimeFormat.example.tsx" />
            </>
        );
    }
}
