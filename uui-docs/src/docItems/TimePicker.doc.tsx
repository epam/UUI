import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '../';
import { DocItem } from './_types/docItem';

export const timePickerExplorerConfig: TDocConfig = {
    name: 'TimePicker',
    contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form, TDocContext.Table],
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:TimePickerProps', component: uui.TimePicker },
        [TSkin.Electric]: { type: '@epam/uui:TimePickerProps', component: electric.TimePicker },
        [TSkin.Loveship]: { type: '@epam/uui:TimePickerProps', component: loveship.TimePicker },
        [TSkin.Promo]: { type: '@epam/uui:TimePickerProps', component: promo.TimePicker },
    },
    doc: (doc: DocBuilder<uui.TimePickerProps>) => {
        doc.merge('minutesStep', { examples: [5, 10, 15] });
        doc.merge('mode', { defaultValue: 'form' });
        doc.merge('value', {
            editorType: 'JsonEditor',
            examples: [
                { name: '6:20', value: { hours: 6, minutes: 20 }, isDefault: true },
                { name: 'undefined', value: undefined },
                { name: 'null', value: null },
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

export const TimePickerDocItem: DocItem = {
    id: 'timePicker',
    name: 'Time Picker',
    parentId: 'components',
    examples: [
        { descriptionPath: 'timePicker-descriptions' },
        { name: 'Basic', componentPath: './_examples/timePicker/Basic.example.tsx' },
        { name: '24-hour format', componentPath: './_examples/timePicker/TimeFormat.example.tsx' },
    ],
    explorerConfig: timePickerExplorerConfig,
};
