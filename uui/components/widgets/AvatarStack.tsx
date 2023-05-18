import * as React from 'react';
import { AvatarStack as uuiAvatarStack, AvatarStackProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './AvatarStack.module.scss';

export const AvatarStack = withMods<AvatarStackProps>(uuiAvatarStack, () => [css.root]);
