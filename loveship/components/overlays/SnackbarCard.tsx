import * as React from 'react';
import cx from 'classnames';
import { IHasChildren, IHasRawProps, INotification } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { IconButton } from '../buttons';
import { ReactComponent as CrossIcon } from './../icons/snackbar/cross.svg';
import { ReactComponent as InfoIcon } from './../icons/snackbar/info.svg';
import { ReactComponent as WarningIcon } from './../icons/snackbar/warning.svg';
import { ReactComponent as SuccessIcon } from './../icons/snackbar/success.svg';
import css from './SnackbarCard.scss';

export interface SnackbarCardProps extends INotification, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    snackType: 'success' | 'warning' | 'info' | 'danger';
}

const SnackbarIcon = {
    success: SuccessIcon,
    warning: WarningIcon,
    danger: CrossIcon,
    info: InfoIcon,
};

export const SnackbarCard = React.forwardRef<HTMLDivElement, SnackbarCardProps>((props, ref) => (
    <div ref={ ref } className={ css.snackbar } { ...props.rawProps }>
        <div className={ cx([css[props.snackType], css.iconContainer]) }>
            <IconContainer icon={ SnackbarIcon[props.snackType] } cx={ css.actionIcon } />
        </div>
        <div className={ css.mainPath }>
            <div className={ css.content }>{props.children}</div>
            <IconButton icon={ CrossIcon } color="night600" onClick={ props.onClose } cx={ css.closeIcon } />
        </div>
    </div>
));
