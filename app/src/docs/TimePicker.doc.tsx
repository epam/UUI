import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class TimePickerDoc extends BaseDocsBlock {
    title = 'TimePicker';

    override config: TDocConfig = {
        name: 'TimePicker',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TimePickerProps', component: uui.TimePicker },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:TimePickerProps',
                component: loveship.TimePicker,
                doc: (doc: DocBuilder<uui.TimePickerProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:TimePickerProps',
                component: promo.TimePicker,
                doc: (doc: DocBuilder<uui.TimePickerProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext, promoDocs.TableContext),
            },
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
