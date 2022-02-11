import * as React from 'react';
import { ProgressBar, IndeterminateBar } from "./";
import cx from 'classnames';
import * as css from './IndicatorBar.scss';
import { IHasCX, IHasRawProps } from "@epam/uui";

interface IIndicatorProps extends IHasCX, IHasRawProps<HTMLDivElement> {
    progress?: number;
}

export const IndicatorBar = React.forwardRef<HTMLDivElement, IIndicatorProps>((props, ref) => {
    const { progress } = props;

    return progress || progress === 0 ?
        <ProgressBar ref={ ref } progress={ progress } cx={ cx(css.root, props.cx) } hideLabel /> :
        <IndeterminateBar ref={ ref } cx={ cx(css.root, props.cx) } />;
});