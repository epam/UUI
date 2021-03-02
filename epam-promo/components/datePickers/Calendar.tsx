import * as css from './Calendar.scss';
import { Calendar as uuiCalendar, CalendarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import moment from 'moment';

export function applyDateSelectionMods() {
    return [
        css.root,
    ];
}

export const Calendar = withMods<CalendarProps<moment.Moment>, {}>(uuiCalendar, applyDateSelectionMods, () => ({}));