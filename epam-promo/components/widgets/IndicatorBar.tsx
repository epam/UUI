import React from 'react';
import { ProgressBar, IndeterminateBar } from './';
import cx from 'classnames';
import css from './IndicatorBar.scss';
import { IHasCX } from '@epam/uui-core';

interface IIndicatorProps extends IHasCX {
    progress?: number;
}

export function IndicatorBar(props: IIndicatorProps) {
    const { progress } = props;

    return progress || progress === 0
        ? <ProgressBar progress={ progress } cx={ cx(css.root, props.cx) } hideLabel />
        : <IndeterminateBar cx={ cx(css.root, props.cx) } />;
}
