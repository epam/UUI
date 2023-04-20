import * as React from 'react';
import { withMods, ModalFooterCoreProps, ModalWindowProps, ModalBlockerProps, ModalHeaderCoreProps } from '@epam/uui-core';
import { ModalBlocker as uuiModalBlocker, ModalWindow as uuiModalWindow } from '@epam/uui-components';
import { FlexRow, RowMods } from '../layout';
import { FlexSpacer, FlexCell } from '@epam/uui';
import { IconButton } from '../buttons';
import { Text } from '../typography';
import { ReactComponent as CrossIcon } from '../../icons/navigation-close-24.svg';
import css from './Modals.scss';

export interface ModalBlockerMods {
    blockerShadow?: 'light' | 'dark' | 'none';
}

export const ModalBlocker = withMods<ModalBlockerProps, ModalBlockerMods>(uuiModalBlocker, (mods) => [css.modalBlocker, css['shadow-' + (mods.blockerShadow || 'dark')]]);

export interface ModalWindowMods {
    width?: '300' | '420' | '600' | '900';
    height?: '300' | '700' | 'auto';
}

export const ModalWindow = withMods<ModalWindowProps, ModalWindowMods>(uuiModalWindow, (mods) => [
    css.modal,
    css['width-' + (mods.width || '420')],
    css['height-' + (mods.height || 'auto')],
]);

export interface ModalHeaderProps extends RowMods, ModalHeaderCoreProps {}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>((props, ref) => (
    <FlexRow
        background={props.background || 'none'}
        padding={props.padding || '24'}
        vPadding="12"
        borderBottom={props.borderBottom}
        cx={[css.modalHeader, props.cx]}
        spacing="12"
        ref={ref}
        rawProps={props.rawProps}
    >
        {props.title && (
            <Text size="48" fontSize="18" font="sans-semibold">
                {props.title}
            </Text>
        )}
        {props.children}
        {props.onClose && <FlexSpacer />}
        {props.onClose && (
            <FlexCell shrink={0} width="auto">
                <IconButton icon={CrossIcon} onClick={props.onClose} />
            </FlexCell>
        )}
    </FlexRow>
));

export interface ModalFooterProps extends RowMods, ModalFooterCoreProps {}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>((props, ref) => (
    <FlexRow
        ref={ref}
        spacing={props.spacing || '12'}
        cx={[css.modalFooter, props.borderTop && css.borderTop, props.cx]}
        padding={props.padding || '24'}
        vPadding={props.vPadding || '24'}
        background={props.background || 'none'}
        rawProps={props.rawProps}
    >
        {props.children}
    </FlexRow>
));
