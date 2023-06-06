import * as React from 'react';
import { Spinner as uuiSpinner, SpinnerProps as UuiSpinnerProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './Spinner.module.scss';

export type SpinnerProps = UuiSpinnerProps;

export function applySpinnerMods() {
    return [css.root];
}

export const Spinner = withMods<UuiSpinnerProps>(uuiSpinner, applySpinnerMods);
