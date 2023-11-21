import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { TimePicker } from '@epam/uui';
import { TimePickerProps } from '@epam/uui';
import { DefaultContext, iEditable, IHasEditModeDoc, isDisabledDoc, isInvalidDoc, ResizableContext, sizeDoc } from '../../docs';

const TimePickerDoc = new DocBuilder<TimePickerProps>({ name: 'TimePicker', component: TimePicker })
    .implements([
        iEditable, sizeDoc, isDisabledDoc, isReadonlyDoc, isInvalidDoc, IHasEditModeDoc,
    ])
    .prop('value', { examples: [{ name: '6:20', value: { hours: 6, minutes: 20 }, isDefault: true }] })
    .prop('minutesStep', {
        examples: [
            5, 10, 15,
        ],
        defaultValue: 5,
    })
    .prop('format', { examples: [12, 24], defaultValue: 12 })
    .withContexts(DefaultContext, ResizableContext);

export default TimePickerDoc;
