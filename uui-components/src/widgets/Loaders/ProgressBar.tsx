import React from 'react';
import { IHasCX, cx } from "@epam/uui";
import * as css from './ProgressBar.scss';

export interface IProgressBarProps extends IHasCX {
    progress: number;
    label?: string;
    hideLabel?: boolean;
}

export const ProgressBar = (props: IProgressBarProps) => {
    const { hideLabel = false, progress, label  } = props;
    const barLabel = label || `${ props.progress || 0 }%`;

    return (
        <div className={ cx(props.cx, css.container) } >
            <div
                role="progressbar"
                className={ cx(css.bar, 'bar') }
                style={ { width: `${ props.progress || 0 }%` } }
                aria-valuenow={ progress }
                aria-valuemin={ 0 }
                aria-valuemax={ 100 }
            />
            { !hideLabel && (
                <>
                    <div className={ cx(css.label, 'label') } >
                        { barLabel }
                    </div>
                    <div className={ cx(css.label, 'topLabel') }
                         style={ { clipPath: `inset(0 0 0 ${ props.progress }%)` } }
                    >
                        { barLabel }
                    </div>
                </>
            )
            }
        </div>
    );
};