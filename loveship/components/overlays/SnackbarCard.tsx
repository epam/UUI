import React from 'react';
import { IHasChildren, INotification } from '@epam/uui';
import { IconContainer } from '@epam/uui-components';
import { IconButton } from '../buttons';
import { ReactComponent as CrossIcon } from './../icons/snackbar/cross.svg';
import { ReactComponent as InfoIcon } from './../icons/snackbar/info.svg';
import { ReactComponent as WarningIcon } from './../icons/snackbar/warning.svg';
import { ReactComponent as SuccessIcon } from './../icons/snackbar/success.svg';
import * as css from './SnackbarCard.scss';
import cx from 'classnames';

export interface SnackbarCardProps extends INotification, IHasChildren {
    snackType: 'success' | 'warning' | 'info' | 'danger';
}

export class SnackbarCard extends React.Component<SnackbarCardProps> {
    render() {
        let icon = {
            success : SuccessIcon,
            warning : WarningIcon,
            danger : CrossIcon,
            info : InfoIcon,
        };

        return <div className={ css.snackbar }>
            <div className={ cx([css[this.props.snackType], css.iconContainer]) }><IconContainer icon={ icon[this.props.snackType] } cx={ css.actionIcon } /></div>
            <div className={ css.mainPath }>
                <div className={ css.content }>
                    { this.props.children }
                </div>
                <IconButton icon={ CrossIcon } color='night600' onClick={ this.props.onClose } cx={ css.closeIcon } />
            </div>
        </div>;
    }
}
