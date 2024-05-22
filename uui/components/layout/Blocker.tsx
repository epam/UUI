import React from 'react';
import { withMods } from '@epam/uui-core';
import { Blocker as uuiBlocker, BlockerProps } from '@epam/uui-components';
import { Spinner } from '../widgets';
import css from './Blocker.module.scss';

export const Blocker = withMods<BlockerProps, BlockerProps>(
    uuiBlocker,
    () => [css.root],
    (cmpProps) => ({ renderSpinner: cmpProps.renderSpinner || (() => <Spinner />) }),
);
