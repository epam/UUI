import React from 'react';
import moment from 'moment';
import { DocBuilder } from '@epam/uui-docs';
import { CalendarProps } from '@epam/uui-components';
import { Calendar } from '../Calendar';
import { iEditable } from '../../../docs';
import { FormContext, DefaultContext, GridContext, ResizableContext } from '../../../docs';

const DatepickerDoc = new DocBuilder<CalendarProps<moment.Moment>>({ name: 'Calendar', component: Calendar as React.ComponentClass<any> })
    .implements([iEditable] as any)
    .prop('value', { examples: [{ value: moment('2017-12-30') }] })
    .prop('displayedDate', { examples: [{ value: moment('2017-12-30'), isDefault: true }], isRequired: true })
    .prop('filter', { examples: [
            {
                name: 'Filter before current day',
                value: (day: moment.Moment) => day.valueOf() >= moment().subtract(1, 'days').valueOf(),
            },
        ] })
    .prop('hideAnotherMonths', {examples: [true, false]})
    .withContexts(DefaultContext, FormContext, ResizableContext, GridContext);

export = DatepickerDoc;
