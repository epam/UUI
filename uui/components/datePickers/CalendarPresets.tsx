import css from './CalendarPresets.module.scss';
import { CalendarPresets as uuiCalendarPresets, CalendarPresetsProps } from '@epam/uui-components'; // TODO: rework presets to use LinkButton
import { withMods } from '@epam/uui-core';

export function applyCalendarPresetsMods() {
    return [css.root];
}

export const CalendarPresets = withMods<CalendarPresetsProps, CalendarPresetsProps>(uuiCalendarPresets, applyCalendarPresetsMods, () => ({}));
