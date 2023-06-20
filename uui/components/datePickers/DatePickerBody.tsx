import css from './DatePicker.module.scss';
import calendarCss from './Calendar.module.scss';
import { DatePickerBody as uuiDatePickerBody, DatePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ReactComponent as ArrowIcon } from '../../icons/folding-arrow-18.svg';

export function applyDatePickerBodyMods() {
    return [css.root, calendarCss.root];
}

export const DatePickerBody = withMods<DatePickerBodyProps>(uuiDatePickerBody, applyDatePickerBodyMods, () => ({ navIconLeft: ArrowIcon, navIconRight: ArrowIcon }));
