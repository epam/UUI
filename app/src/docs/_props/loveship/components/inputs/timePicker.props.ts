import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { TimePicker, TimePickerProps } from '@epam/loveship';
import { DefaultContext, FormContext, iEditable, isDisabledDoc, isInvalidDoc, modeDoc, ResizableContext, sizeDoc, TableContext } from '../../docs';

const TimePickerDoc = new DocBuilder<TimePickerProps>({ name: 'TimePicker', component: TimePicker })
    .implements([iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, modeDoc])
    .prop('value', { examples: [{ name: '6:20', value: { hours: 6, minutes: 20 }, isDefault: true }] })
    .prop('minutesStep', { examples: [5, 10, 15], defaultValue: 5 })
    .prop('format', { examples: [12, 24], defaultValue: 12 })
    .withContexts(DefaultContext, ResizableContext, FormContext, TableContext);

export default TimePickerDoc;
