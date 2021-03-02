import React from 'react';
import { TimePicker, TimePickerProps } from '../TimePicker';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { iEditable, sizeDoc, isDisabledDoc, isInvalidDoc, modeDoc } from '../../../docs';
import { FormContext, DefaultContext, GridContext, ResizableContext } from '../../../docs';

const TimePickerDoc = new DocBuilder<TimePickerProps>({ name: 'TimePicker', component: TimePicker as React.ComponentClass<any> })
    .implements([iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, modeDoc] as any)
    .prop('value', { examples: [{ name: '6:20', value: { hours: 6, minutes: 20 }, isDefault: true }] })
    .prop('minutesStep', { examples: [5, 10, 15], defaultValue: 5 })
    .prop('format', { examples: [12, 24], defaultValue: 12 })
    .withContexts(DefaultContext, ResizableContext, GridContext, FormContext);

export = TimePickerDoc;