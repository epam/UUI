import { Spinner as uuiSpinner, SpinnerProps as uuiSpinnerProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './Spinner.module.scss';

export type SpinnerProps = uuiSpinnerProps;

function applySpinnerMods() {
    return [css.root, 'uui-spinner'];
}

export const Spinner = withMods<uuiSpinnerProps, uuiSpinnerProps>(uuiSpinner, applySpinnerMods);
