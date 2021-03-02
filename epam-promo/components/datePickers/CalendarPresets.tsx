import * as css from './CalendarPresets.scss';
import { CalendarPresets as uuiCalendarPresets, CalendarPresetsProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';

export function applyCalendarPresetsMods() {
    return [
        css.root,
    ];
}

export const CalendarPresets = withMods<CalendarPresetsProps, {}>(uuiCalendarPresets, applyCalendarPresetsMods, () => ({}));