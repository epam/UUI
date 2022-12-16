// import * as css from './DatePicker.scss';
import rangeCss from './RangeDatePickerBody.scss';
// import * as calendarCss from '@epam/uui';
import calendarPresetsCss from './CalendarPresets.scss';
import { RangeDatePickerBody as uuiRangeDatePickerBody, RangeDatePickerValue, RangeDatePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ReactComponent as ArrowIcon } from './../icons/folding-arrow-24.svg';

export function applyRangeDatePickerBodyMods() {
    return [
        // css.root,
        rangeCss.root,
        // calendarCss.root,
        calendarPresetsCss.root,
    ];
}

export const RangeDatePickerBody = withMods<RangeDatePickerBodyProps<RangeDatePickerValue>>(
    uuiRangeDatePickerBody,
    applyRangeDatePickerBodyMods,
    () => ({ navIconLeft: ArrowIcon, navIconRight: ArrowIcon }),
);
