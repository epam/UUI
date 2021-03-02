import * as css from './DatePicker.scss';
import * as calendarCss from './Calendar.scss';
import { DatePickerBody as uuiDatePickerBody, DatePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as arrowIcon from './../icons/folding-arrow-24.svg';

export function applyDatePickerBodyMods() {
    return [
        css.root,
        calendarCss.root,
    ];
}

export const DatePickerBody = withMods<DatePickerBodyProps>(
    uuiDatePickerBody as any,
    applyDatePickerBodyMods,
    () => ({ navIconLeft: arrowIcon, navIconRight: arrowIcon }),
);