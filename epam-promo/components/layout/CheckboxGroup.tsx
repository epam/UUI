import { withMods } from '@epam/uui-core';
import { CheckboxGroup as uuiCheckboxGroup, CheckboxGroupProps } from '@epam/uui-components';
import { Checkbox } from '@epam/uui';
import css from './CheckboxGroup.scss';

export const CheckboxGroup = withMods<CheckboxGroupProps<any>>(uuiCheckboxGroup, () => [css.root], () => ({ CheckboxInput: Checkbox }));
