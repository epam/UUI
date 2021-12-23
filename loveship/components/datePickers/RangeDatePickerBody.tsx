import * as css from './DatePicker.scss';
import * as rangeCss from './RangeDatePickerBody.scss';
import * as calendarCss from './Calendar.scss';
import * as calendarPresetsCss from './CalendarPresets.scss';
import { RangeDatePickerBody as uuiRangeDatePickerBody, RangeDatePickerValue, RangeDatePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { ReactComponent as ArrowIcon } from './../icons/folding-arrow-24.svg';

export function applyRangeDatePickerBodyMods() {
    return [
        css.root,
        rangeCss.root,
        calendarCss.root,
        calendarPresetsCss.root,
    ];
}

export const RangeDatePickerBody = withMods<RangeDatePickerBodyProps<RangeDatePickerValue>>(
    uuiRangeDatePickerBody,
    applyRangeDatePickerBodyMods,
    () => ({ navIconLeft: ArrowIcon, navIconRight: ArrowIcon }),
);