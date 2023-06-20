import React from 'react';
import css from './Blocker.module.scss';
import { withMods } from '@epam/uui-core';
import { Blocker as uuiBlocker, BlockerProps } from '@epam/uui-components';
import { Spinner } from '../widgets/Spinner';

export const Blocker = withMods<BlockerProps>(
    uuiBlocker,
    () => [css.root],
    (cmpProps) => ({ renderSpinner: cmpProps.renderSpinner || (() => <Spinner />) }),
);
