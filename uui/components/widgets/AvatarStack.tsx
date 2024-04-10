import { AvatarStack as uuiAvatarStack, AvatarStackProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './AvatarStack.module.scss';

export const AvatarStack = /* @__PURE__ */withMods<AvatarStackProps>(uuiAvatarStack, () => [css.root]);
