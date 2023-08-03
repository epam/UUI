import React from 'react';
import { ProgressBar } from './ProgressBar';
import cx from 'classnames';
import css from './IndicatorBar.module.scss';
import { IHasCX } from '@epam/uui-core';
import { IndeterminateBar } from '@epam/uui';

interface IIndicatorProps extends IHasCX {
    progress?: number;
}

export function IndicatorBar(props: IIndicatorProps) {
    const { progress } = props;

    return progress || progress === 0
        ? <ProgressBar progress={ progress } cx={ cx(css.root, props.cx) } hideLabel />
        : <IndeterminateBar cx={ cx(css.root, props.cx) } />;
}
