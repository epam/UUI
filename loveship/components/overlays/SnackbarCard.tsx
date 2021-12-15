import * as React from 'react';
import { IHasChildren, INotification, cx } from '@epam/uui';
import { IconContainer } from '@epam/uui-components';
import { IconButton } from '../buttons';
import * as crossIcon from './../icons/snackbar/cross.svg';
import * as infoIcon from './../icons/snackbar/info.svg';
import * as warningIcon from './../icons/snackbar/warning.svg';
import * as successIcon from './../icons/snackbar/success.svg';
import * as css from './SnackbarCard.scss';

export interface SnackbarCardProps extends INotification, IHasChildren {
    snackType: 'success' | 'warning' | 'info' | 'danger';
}

const icon = {
    success : successIcon,
    warning : warningIcon,
    danger : crossIcon,
    info : infoIcon,
};

export class SnackbarCard extends React.Component<SnackbarCardProps> {
    render() {
        return (
            <div className={ css.snackbar }>
                <div className={ cx([css[this.props.snackType], css.iconContainer]) }>
                    <IconContainer icon={ icon[this.props.snackType] } cx={ css.actionIcon } />
                </div>
                <div className={ css.mainPath }>
                    <div className={ css.content }>
                        { this.props.children }
                    </div>
                    <IconButton icon={ crossIcon } color='night600' onClick={ this.props.onClose } cx={ css.closeIcon } />
                </div>
            </div>
        );
    }
}
