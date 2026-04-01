import { withMods } from '@epam/uui-core';
import { Blocker as uuiBlocker, BlockerProps, BlockerInset as uuiBlockerInset } from '@epam/uui-components';
import css from './Blocker.module.scss';
import { settings } from '../../settings';

export type BlockerInset = uuiBlockerInset;

export const Blocker = withMods<BlockerProps, BlockerProps>(
    uuiBlocker,
    () => [css.root],
    () => ({ renderSpinner: settings.blocker.renderSpinner }),
);
