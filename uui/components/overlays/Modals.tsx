import * as React from 'react';
import { withMods, ModalFooterCoreProps, ModalWindowProps, ModalBlockerProps, ModalHeaderCoreProps } from '@epam/uui-core';
import { ModalBlocker as uuiModalBlocker, ModalWindow as uuiModalWindow } from '@epam/uui-components';
import { FlexRow, FlexSpacer, RowMods, FlexCell } from '../layout';
import { IconButton } from '../buttons';
import { Text } from '../typography';
import { ReactComponent as CrossIcon } from '../../icons/navigation-close-24.svg';
import '../../assets/styles/variables/overlays/modals.scss';
import css from './Modals.scss';

export interface ModalBlockerMods {
    overlay?: boolean;
}

export const ModalBlocker = withMods<ModalBlockerProps, ModalBlockerMods>(uuiModalBlocker, mods => [
    'modals-vars',
    css.modalBlocker,
    mods.overlay && css['blocker-overlay'],
]);

export interface ModalWindowMods {
    width?: number;
    height?: number | 'auto';
}

export const ModalWindow = withMods<ModalWindowProps, ModalWindowMods>(
    uuiModalWindow,
    () => ['modals-vars', css.modal],
    props => ({
        rawProps: {
            style: {
                width: `${props.width || 480}px`,
                height: props.height ? `${props.height}px` : '',
            },
        },
    })
);

export interface ModalHeaderProps extends RowMods, ModalHeaderCoreProps {}

export class ModalHeader extends React.Component<ModalHeaderProps> {
    render() {
        return (
            <FlexRow
                padding={this.props.padding || '24'}
                vPadding="12"
                borderBottom
                cx={['modals-vars', css.modalHeader, this.props.cx]}
                spacing="12"
                rawProps={this.props.rawProps}
            >
                {this.props.title && (
                    <Text size="48" fontSize="18" font="semibold">
                        {this.props.title}
                    </Text>
                )}
                {this.props.children}
                {this.props.onClose && <FlexSpacer />}
                {this.props.onClose && (
                    <FlexCell shrink={0} width="auto">
                        <IconButton icon={CrossIcon} onClick={this.props.onClose} />
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
                spacing={this.props.spacing || '12'}
                cx={['modals-vars', css.modalFooter, this.props.borderTop && css.borderTop, this.props.cx]}
                padding={this.props.padding || '24'}
                vPadding={this.props.vPadding || '24'}
                rawProps={this.props.rawProps}
            >
                {this.props.children}
            </FlexRow>
        );
    }
}
