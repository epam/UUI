import React from 'react';
import css from './Blocker.scss';
import { withMods } from '@epam/uui-core';
import { Blocker as uuiBlocker, BlockerProps } from '@epam/uui-components';
import { Spinner, SpinnerColor } from '../widgets';

export interface BlockerMods {
    /** Spinner icon color */
    color?: SpinnerColor;
}

export const Blocker = withMods<BlockerProps, BlockerMods>(uuiBlocker, () => [css.root],
    (cmpProps) => ({ renderSpinner: cmpProps.renderSpinner || ((props: BlockerMods) => <Spinner color={ props.color }/>) }),
);
