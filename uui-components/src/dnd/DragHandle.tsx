import * as React from 'react';
import {
    IDisableable, IHasCX, IHasRawProps, uuiMod,
} from '@epam/uui-core';
import cx from 'classnames';
import css from './DragHandle.scss';

export interface DragHandleProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IDisableable {}

export class DragHandle extends React.Component<DragHandleProps> {
    render() {
        return <div className={ cx(this.props.cx, css.container, 'uui-drag-handle', this.props.isDisabled && uuiMod.disabled) } { ...this.props.rawProps } />;
    }
}
