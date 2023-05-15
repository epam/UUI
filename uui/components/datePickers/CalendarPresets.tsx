import css from './CalendarPresets.module.scss';
import { CalendarPresets as uuiCalendarPresets, CalendarPresetsProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

export function applyCalendarPresetsMods() {
    return [css.root];
}

export const CalendarPresets = withMods<CalendarPresetsProps>(uuiCalendarPresets, applyCalendarPresetsMods, () => ({}));
