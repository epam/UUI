import * as React from 'react';
import { ProgressBar as uuiProgressBar, IProgressBarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './ProgressBar.scss';

const defaultSize = '12';

export interface ProgressBarMods {
    size?: '12' | '18' | '24';
    striped?: boolean;
}

export function applyProgressBarMods(mods: ProgressBarMods) {
    const size = mods.size || defaultSize;

    return [
        css.root, css[`size-${size}`], mods.striped && css.striped,
    ];
}

export const ProgressBar = withMods<IProgressBarProps, ProgressBarMods>(uuiProgressBar, applyProgressBarMods, (props) => ({
    hideLabel: props.hideLabel || props.striped,
}));
