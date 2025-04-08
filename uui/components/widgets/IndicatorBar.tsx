import * as React from 'react';
import cx from 'classnames';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import { ProgressBar } from './ProgressBar';
import { IndeterminateBar } from './IndeterminateBar';
import css from './IndicatorBar.module.scss';

interface IIndicatorProps extends IHasCX, IHasRawProps<HTMLDivElement> {
    progress?: number;
}

export const IndicatorBar = React.forwardRef<HTMLDivElement, IIndicatorProps>((props, ref) => {
    const { progress } = props;

    return progress || progress === 0 ? (
        <ProgressBar ref={ ref } progress={ progress } cx={ cx(css.root, props.cx) } hideLabel />
    ) : (
        <IndeterminateBar ref={ ref } cx={ cx(css.root, props.cx) } />
    );
});
