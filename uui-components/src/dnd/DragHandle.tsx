import * as React from 'react';
import {
    Icon,
    IDisableable, IHasCX, IHasRawProps, uuiMod,
} from '@epam/uui-core';
import cx from 'classnames';
import css from './DragHandle.module.scss';
import { IconContainer } from '../layout';

export interface DragHandleProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IDisableable {
    /**
     * Icon to be used as the drag handle
     */
    dragHandleIcon?: Icon;
}

export class DragHandle extends React.Component<DragHandleProps> {
    render() {
        const { rawProps, dragHandleIcon, isDisabled } = this.props;
        const classes = cx(
            this.props.cx,
            css.container,
            'uui-drag-handle',
            !dragHandleIcon && css.noIcon,
            isDisabled && uuiMod.disabled,
        );
        return (
            <div className={ classes } { ...rawProps }>
                { dragHandleIcon && <IconContainer icon={ dragHandleIcon } isDisabled={ isDisabled } />}
            </div>
        );
    }
}
