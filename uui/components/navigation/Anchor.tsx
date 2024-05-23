import { Anchor as uuiAnchor, AnchorProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './Anchor.module.scss';

export const Anchor = withMods<AnchorProps, AnchorProps>(uuiAnchor, () => [css.root]);
