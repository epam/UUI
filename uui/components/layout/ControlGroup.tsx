import css from './ControlGroup.module.scss';
import { withMods } from '@epam/uui-core';
import { ControlGroup as uuiControlGroup, ControlGroupProps } from '@epam/uui-components';

export const ControlGroup = /* @__PURE__ */withMods<ControlGroupProps>(uuiControlGroup, () => [css.root]);
