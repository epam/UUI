import { TimePickerBody as uuiTimePickerBody, TimePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './TimePicker.module.scss';
import { ReactComponent as ArrowIcon } from './../../icons/folding-arrow-18.svg';

export const TimePickerBody = withMods<TimePickerBodyProps>(
    uuiTimePickerBody,
    () => [css.root],
    () => ({ addIcon: ArrowIcon, subtractIcon: ArrowIcon }),
);
