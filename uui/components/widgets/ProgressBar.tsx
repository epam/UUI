import { ProgressBar as uuiProgressBar, IProgressBarProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './ProgressBar.module.scss';

const DEFAULT_SIZE = '12';

interface ProgressBarMods {
    /**
     * Defines component size.
     * @default '12'
     */
    size?: '12' | '18' | '24';
    /**
     * To show ProgressBar with striped animation. The striped progress bar has no label.
     */
    striped?: boolean;
}

export type ProgressBarProps = IProgressBarProps & ProgressBarMods;

function applyProgressBarMods(mods: ProgressBarMods) {
    const size = mods.size || DEFAULT_SIZE;

    return [
        css.root,
        css[`size-${size}`],
        mods.striped && css.striped,
    ];
}

export const ProgressBar = /* @__PURE__ */withMods<ProgressBarProps, ProgressBarMods>(uuiProgressBar, applyProgressBarMods, (props) => ({
    hideLabel: props.hideLabel || props.striped,
}));
