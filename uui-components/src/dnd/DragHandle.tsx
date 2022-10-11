import * as React from 'react';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import cx from 'classnames';
import * as css from './DragHandle.scss';

export interface DragHandleProps extends IHasCX, IHasRawProps<React.ReactHTMLElement<HTMLDivElement>> {}

export class DragHandle extends React.Component<DragHandleProps> {
    render() {
        return <div className={ cx(this.props.cx, css.container, 'uui-drag-handle') } { ...this.props.rawProps }  />;
    }
}