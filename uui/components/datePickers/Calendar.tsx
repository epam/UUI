import css from './Calendar.module.scss';
import { Calendar as uuiCalendar } from '@epam/uui-components';
import { CalendarProps, withMods } from '@epam/uui-core';
import { Dayjs } from 'dayjs';

export function applyDateSelectionMods() {
    return [css.root];
}

export const Calendar = withMods<CalendarProps<Dayjs>>(uuiCalendar, applyDateSelectionMods);
