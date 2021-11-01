import React from 'react';
import { ProgressBar, IndeterminateBar } from "./";
import * as css from './IndicatorBar.scss';
import { IHasCX, cx } from "@epam/uui";

interface IIndicatorProps extends IHasCX {
    progress?: number;
}

export const IndicatorBar = (props: IIndicatorProps) => {
    const { progress } = props;

    return (progress || progress === 0 ?
            <ProgressBar progress={ progress } cx={ cx(css.root, props.cx) } hideLabel />
        :
            <IndeterminateBar cx={ cx(css.root, props.cx) } />
    );
};