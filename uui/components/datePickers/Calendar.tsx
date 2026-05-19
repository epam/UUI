import { CalendarProps, Calendar as uuiCalendar } from '@epam/uui-components';
import type { Overwrite } from '@epam/uui-core';
import { withMods } from '@epam/uui-core';
import { Dayjs } from '../../helpers/dayJsHelper';
import { settings } from '../../settings';

import css from './Calendar.module.scss';

type CalendarMods = {
    /**
     * Defines calendar size.
     * @default '36'
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

export interface CalendarModsOverride {}

export type CalendarCoreProps = CalendarProps<Dayjs>;

export interface CalendarPropsExtended extends CalendarCoreProps, Overwrite<CalendarMods, CalendarModsOverride> {}

export function applyDateSelectionMods(mods: CalendarPropsExtended) {
    return [css.root, `uui-size-${mods.size ?? settings.datePicker.sizes.body}`];
}

export const Calendar = withMods<CalendarProps<Dayjs>, CalendarPropsExtended>(uuiCalendar, applyDateSelectionMods);
