import { CalendarProps, Calendar as uuiCalendar } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { Dayjs } from '../../helpers/dayJsHelper';
import { settings } from '../../settings';

import css from './Calendar.module.scss';

export function applyDateSelectionMods() {
    return [css.root, `uui-size-${settings.datePicker.sizes.default}`];
}

export const Calendar = withMods<CalendarProps<Dayjs>, CalendarProps<Dayjs>>(uuiCalendar, applyDateSelectionMods);
