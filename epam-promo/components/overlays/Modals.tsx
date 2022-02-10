import * as React from 'react';
import { withMods, ModalFooterCoreProps, ModalWindowProps, ModalBlockerProps, ModalHeaderCoreProps } from '@epam/uui-core';
import { ModalBlocker as uuiModalBlocker, ModalWindow as uuiModalWindow } from '@epam/uui-components';
import { FlexRow, FlexSpacer, RowMods, FlexCell } from '../layout';
import { IconButton } from '../buttons';
import { Text } from '../typography';
import { ReactComponent as CrossIcon } from '../../icons/navigation-close-24.svg';
import * as css from './Modals.scss';

export interface ModalBlockerMods {
    blockerShadow?: 'light' | 'dark' | 'none';
}

export const ModalBlocker = withMods<ModalBlockerProps, ModalBlockerMods>(uuiModalBlocker, mods => [
    css.modalBlocker,
    css['shadow-' + (mods.blockerShadow || 'dark')],
]);

export interface ModalWindowMods {
    width?: '300' | '420' | '600' | '900';
    height?: '300' | '700' | 'auto';
}

export const ModalWindow = withMods<ModalWindowProps, ModalWindowMods>(uuiModalWindow, mods => [
    css.modal,
    css['width-' + (mods.width || '420')],
    css['height-' + (mods.height || 'auto')],
]);

export interface ModalHeaderProps extends RowMods, ModalHeaderCoreProps {}

export class ModalHeader extends React.Component<ModalHeaderProps> {
    render() {
        return (
            <FlexRow
                background={ this.props.background || 'none' }
                padding={ this.props.padding || '24' }
                vPadding='12'
                borderBottom={ this.props.borderBottom ? 'gray40' : undefined }
                cx={ [css.modalHeader, this.props.cx] }
                spacing='12'
                rawProps={ this.props.rawProps }
            >
                { this.props.title && <Text size='48' fontSize='18' font='sans-semibold'>{ this.props.title }</Text> }
                { this.props.children }
                { this.props.onClose && <FlexSpacer /> }
                { this.props.onClose && <FlexCell shrink={ 0 } width='auto'><IconButton icon={ CrossIcon } onClick={ this.props.onClose } /></FlexCell> }
            </FlexRow>
        );
    }
}

export interface ModalFooterProps extends RowMods, ModalFooterCoreProps {}

export class ModalFooter extends React.Component<ModalFooterProps> {
    render() {
        return (
            <FlexRow
                spacing={ this.props.spacing || '12' }
                cx={ [css.modalFooter, this.props.borderTop && css.borderTop, this.props.cx] }
                padding={ this.props.padding || '24' }
                vPadding={ this.props.vPadding || '24' }
                background={ this.props.background || 'none' }
                rawProps={ this.props.rawProps }
            >
                { this.props.children }
            </FlexRow>
        );
    }
}
