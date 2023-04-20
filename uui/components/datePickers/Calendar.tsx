import css from './Calendar.scss';
import { Calendar as uuiCalendar, CalendarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { Dayjs } from 'dayjs';

export function applyDateSelectionMods() {
    return [css.root];
}

export const Calendar = withMods<CalendarProps<Dayjs>>(uuiCalendar, applyDateSelectionMods);
