import * as React from 'react';
import { withMods, ModalFooterCoreProps, ModalWindowProps as uuiModalWindowProps, ModalBlockerProps, ModalHeaderCoreProps } from '@epam/uui-core';
import { ModalBlocker as uuiModalBlocker, ModalWindow as uuiModalWindow } from '@epam/uui-components';
import { FlexRow, FlexSpacer, RowMods, FlexCell, FlexRowProps } from '../layout';
import { IconButton } from '../buttons';
import { Text } from '../typography';
import { isMobile } from '@epam/uui-core';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/navigation-close-outline.svg';
import css from './Modals.module.scss';

export const ModalBlocker = /* @__PURE__ */withMods<ModalBlockerProps>(uuiModalBlocker, () => [css.modalBlocker]);

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

export const ModalWindow = /* @__PURE__ */withMods<uuiModalWindowProps, ModalWindowMods>(
    uuiModalWindow,
    () => [css.root, css.modal],
    (props) => {
        const normalize = (d: number | string | undefined): string | undefined => {
            if (typeof d === 'number') {
                return `${d}px`;
            }
            return d;
        };
        const width = normalize(props.width) || '420px';
        const height = normalize(props.height) || 'auto';
        const maxHeight = isMobile() ? '100dvh' : (normalize(props.maxHeight) || '80dvh');
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
                padding={ this.props.padding || '24' }
                vPadding="12"
                borderBottom={ this.props.borderBottom }
                cx={ [css.root, css.modalHeader, this.props.cx] }
                columnGap="12"
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

export interface ModalFooterProps extends FlexRowProps, ModalFooterCoreProps {}

export class ModalFooter extends React.Component<ModalFooterProps> {
    render() {
        return (
            <FlexRow
                columnGap={ this.props.columnGap || '12' }
                cx={ [
                    css.root,
                    css.modalFooter,
                    this.props.cx,
                ] }
                borderTop={ this.props.borderTop }
                padding={ this.props.padding || '24' }
                vPadding={ this.props.vPadding || '24' }
                rawProps={ this.props.rawProps }
            >
                {this.props.children}
            </FlexRow>
        );
    }
}
