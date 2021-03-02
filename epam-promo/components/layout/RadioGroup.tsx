import * as React from 'react';
import { withMods } from '@epam/uui';
import { RadioGroup as uuiRadioGroup, RadioGroupProps } from '@epam/uui-components';
import { RadioInput } from '../inputs';
import * as css from './RadioGroup.scss';

export const RadioGroup = withMods<RadioGroupProps<any>>(uuiRadioGroup, () => [css.root], () => ({ RadioInput }));