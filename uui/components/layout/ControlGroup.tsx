import css from './ControlGroup.scss';
import { withMods } from '@epam/uui-core';
import { ControlGroup as uuiControlGroup, ControlGroupProps } from '@epam/uui-components';

export const ControlGroup = withMods<ControlGroupProps>(uuiControlGroup, () => [css.root]);
