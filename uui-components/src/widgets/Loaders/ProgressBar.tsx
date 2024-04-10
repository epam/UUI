import * as React from 'react';
import cx from 'classnames';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import css from './ProgressBar.module.scss';

export interface IProgressBarProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    progress: number;
    label?: string;
    hideLabel?: boolean;
}

export const ProgressBar = /* @__PURE__ */React.forwardRef<HTMLDivElement, IProgressBarProps>((props, ref) => {
    const { hideLabel = false, progress, label } = props;
    const barLabel = label || `${props.progress || 0}%`;

    return (
        <div ref={ ref } className={ cx('uui-progress_bar', props.cx, css.container) } { ...props.rawProps }>
            <div
                role="progressbar"
                className={ cx(css.bar, 'bar') }
                style={ { width: `${props.progress || 0}%` } }
                aria-valuenow={ progress }
                aria-valuemin={ 0 }
                aria-valuemax={ 100 }
            />
            {!hideLabel && (
                <>
                    <div className={ cx(css.label, 'label') }>{barLabel}</div>
                    <div className={ cx(css.label, 'topLabel') } style={ { clipPath: `inset(0 0 0 ${props.progress}%)` } }>
                        {barLabel}
                    </div>
                </>
            )}
        </div>
    );
});
