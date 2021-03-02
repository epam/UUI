import * as React from 'react';
import { IHasCX } from '@epam/uui';
import cx from 'classnames';
import * as css from './DragHandle.scss';

export interface DragHandleProps extends IHasCX {
}

export class DragHandle extends React.Component<DragHandleProps> {
    render() {
        return <div className={ cx(this.props.cx, css.container, 'uui-drag-handle') } />;
    }
}