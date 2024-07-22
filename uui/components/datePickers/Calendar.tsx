import css from './Calendar.module.scss';
import { CalendarProps, Calendar as uuiCalendar } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { Dayjs } from '../../helpers/dayJsHelper';
import { settings } from '../../settings';

export function applyDateSelectionMods() {
    return [css.root, `uui-size-${settings.sizes.defaults.datePicker}`];
}

export const Calendar = withMods<CalendarProps<Dayjs>, CalendarProps<Dayjs>>(uuiCalendar, applyDateSelectionMods);
