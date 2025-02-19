import React from 'react';
import cx from 'classnames';
import {
    withMods, ModalFooterCoreProps, ModalWindowProps as uuiModalWindowProps, ModalBlockerProps, ModalHeaderCoreProps, isMobile,
} from '@epam/uui-core';
import { ModalBlocker as uuiModalBlocker, ModalWindow as uuiModalWindow } from '@epam/uui-components';
import { FlexRow, FlexSpacer, RowMods, FlexCell, FlexRowProps } from '../layout';
import { IconButton } from '../buttons';
import { settings } from '../../settings';

import css from './Modals.module.scss';

export const ModalBlocker = withMods<ModalBlockerProps, ModalBlockerProps>(uuiModalBlocker, () => [css.modalBlocker]);

interface ModalWindowMods {
    /**
     * Defines component width.
     * @default '420px'
     */
    width?: number | string;
    /**
     * Defines component height.
     * @default 'auto'
     */
    height?: number | string;
    /**
     * Defines component max-height.
     * @default '80vh'
     */
    maxHeight?: number | string;
}

export interface ModalWindowCoreProps extends uuiModalWindowProps {}

export interface ModalWindowProps extends ModalWindowCoreProps, ModalWindowMods {}

export const ModalWindow = withMods<uuiModalWindowProps, ModalWindowProps>(
    uuiModalWindow,
    () => [css.root, css.modal],
    (props) => {
        const width = props.width || settings.modal.sizes.defaultWidth;
        const height = props.height || 'auto';
        const maxHeight = isMobile() ? settings.modal.sizes.defaultMobileMaxHeight : (props.maxHeight || settings.modal.sizes.defaultMaxHeight);
        return {
            style: {
                ...props.style,
                width,
                height,
                maxHeight,
            },
        };
    },
);

export interface ModalHeaderProps extends RowMods, ModalHeaderCoreProps {}

export class ModalHeader extends React.Component<ModalHeaderProps> {
    render() {
        return (
            <FlexRow
                padding={ this.props.padding || settings.modal.sizes.defaultHeaderPadding }
                size={ null }
                vPadding="36"
                borderBottom={ this.props.borderBottom }
                cx={ [css.root, css.modalHeader, this.props.cx] }
                columnGap="12"
                rawProps={ this.props.rawProps }
            >
                {this.props.title && (
                    <div className={ cx('uui-modal-title', 'uui-typography') }>
                        {this.props.title}
                    </div>
                )}
                {this.props.children}
                {this.props.onClose && <FlexSpacer />}
                {this.props.onClose && (
                    <FlexCell shrink={ 0 } width="auto">
                        <IconButton rawProps={ { 'aria-label': 'Close modal' } } icon={ settings.modal.icons.closeIcon } onClick={ this.props.onClose } />
                    </FlexCell>
                )}
            </FlexRow>
        );
    }
}

export interface ModalFooterProps extends FlexRowProps, ModalFooterCoreProps {}

export class ModalFooter extends React.Component<ModalFooterProps> {
    render() {
        return (
            <FlexRow
                columnGap={ this.props.columnGap || settings.modal.sizes.defaultFooterColumnGap }
                cx={ [
                    css.root,
                    css.modalFooter,
                    this.props.cx,
                ] }
                borderTop={ this.props.borderTop }
                padding={ this.props.padding || settings.modal.sizes.defaultFooterPadding }
                vPadding={ this.props.vPadding || settings.modal.sizes.defaultFooterVPadding }
                rawProps={ this.props.rawProps }
            >
                {this.props.children}
            </FlexRow>
        );
    }
}
