import * as React from 'react';
import { withMods, ModalFooterCoreProps, ModalWindowProps as UuiModalWindowProps, ModalBlockerProps, ModalHeaderCoreProps } from '@epam/uui-core';
import { ModalBlocker as uuiModalBlocker, ModalWindow as uuiModalWindow } from '@epam/uui-components';
import { FlexRow, FlexSpacer, RowMods, FlexCell } from '../layout/FlexItems';
import { IconButton } from '../buttons';
import { Text } from '../typography';
import { ReactComponent as CrossIcon } from '../../icons/navigation-close-24.svg';
import css from './Modals.module.scss';

export const ModalBlocker = withMods<ModalBlockerProps>(uuiModalBlocker, () => [css.modalBlocker]);

export interface ModalWindowMods {
    /**
     * Defines component width.
     * @default '420px'
     */
    width?: number;
    /**
     * Defines component height.
     * @default 'auto'
     */
    height?: number;
}

export type ModalWindowCoreProps = UuiModalWindowProps;

export type ModalWindowProps = ModalWindowCoreProps & ModalWindowMods;

export const ModalWindow = withMods<UuiModalWindowProps, ModalWindowMods>(
    uuiModalWindow,
    () => [css.root, css.modal],
    (props) => ({
        style: {
            ...props.style,
            width: `${props.width || 420}px`,
            height: props.height ? `${props.height}px` : 'auto',
        },
    }),
);

export interface ModalHeaderProps extends RowMods, ModalHeaderCoreProps {}

export class ModalHeader extends React.Component<ModalHeaderProps> {
    render() {
        return (
            <FlexRow
                padding={ this.props.padding || '24' }
                vPadding="12"
                borderBottom={ this.props.borderBottom }
                cx={ [css.root, css.modalHeader, this.props.cx] }
                spacing="12"
                rawProps={ this.props.rawProps }
            >
                {this.props.title && (
                    <Text size="48" fontSize="18" fontWeight="600">
                        {this.props.title}
                    </Text>
                )}
                {this.props.children}
                {this.props.onClose && <FlexSpacer />}
                {this.props.onClose && (
                    <FlexCell shrink={ 0 } width="auto">
                        <IconButton rawProps={ { 'aria-label': 'Close modal' } } icon={ CrossIcon } onClick={ this.props.onClose } />
                    </FlexCell>
                )}
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
                cx={ [
                    css.root,
                    css.modalFooter,
                    this.props.borderTop && css.borderTop,
                    this.props.cx,
                ] }
                padding={ this.props.padding || '24' }
                vPadding={ this.props.vPadding || '24' }
                rawProps={ this.props.rawProps }
            >
                {this.props.children}
            </FlexRow>
        );
    }
}
