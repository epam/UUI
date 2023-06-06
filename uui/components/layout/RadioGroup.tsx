import { withMods } from '@epam/uui-core';
import { RadioGroup as uuiRadioGroup, RadioGroupProps } from '@epam/uui-components';
import { RadioInput } from '../inputs';
import css from './RadioGroup.module.scss';

export const RadioGroup = withMods<RadioGroupProps<any>>(
    uuiRadioGroup,
    () => [css.root],
    () => ({ RadioInput }),
);
