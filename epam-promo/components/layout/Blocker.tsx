import React from 'react';
import * as css from './Blocker.scss';
import { withMods } from '@epam/uui';
import { Blocker as uuiBlocker, BlockerProps } from '@epam/uui-components';
import { Spinner, SpinnerColor } from '../widgets';

export interface BlockerMods {
    color?: SpinnerColor;
}

export const Blocker = withMods<BlockerProps, BlockerMods>(uuiBlocker, () => [css.root],
    (cmpProps) => ({ renderSpinner: cmpProps.renderSpinner || ((props: BlockerMods) => <Spinner color={ props.color }/>) }),
);
