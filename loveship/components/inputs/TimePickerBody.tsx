import css from './TimePicker.scss';
import { TimePickerBody as uuiTimePickerBody, TimePickerBodyProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ReactComponent as ArrowIcon } from './../icons/folding-arrow-24.svg';

export const TimePickerBody = withMods<TimePickerBodyProps>(
    uuiTimePickerBody,
    () => [css.root],
    () => ({ addIcon: ArrowIcon, subtractIcon: ArrowIcon }),
);
