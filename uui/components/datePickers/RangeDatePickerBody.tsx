import css from './DatePicker.scss';
import rangeCss from './RangeDatePickerBody.scss';
import calendarCss from './Calendar.scss';
import calendarPresetsCss from './CalendarPresets.scss';
import { RangeDatePickerBody as uuiRangeDatePickerBody, RangeDatePickerValue, RangeDatePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ReactComponent as ArrowIcon } from '../../icons/folding-arrow-18.svg';

export function applyRangeDatePickerBodyMods() {
    return [css.root, rangeCss.root, calendarCss.root, calendarPresetsCss.root];
}

export const RangeDatePickerBody = withMods<RangeDatePickerBodyProps<RangeDatePickerValue>>(uuiRangeDatePickerBody, applyRangeDatePickerBodyMods, () => ({
    navIconLeft: ArrowIcon,
    navIconRight: ArrowIcon,
}));
