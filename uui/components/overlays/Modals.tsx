import React from 'react';
import cx from 'classnames';
import {
    withMods,
    ModalFooterCoreProps,
    ModalWindowProps as uuiModalWindowProps,
    ModalBlockerProps,
    ModalHeaderCoreProps,
    isMobile,
    Overwrite,
} from '@epam/uui-core';
import { ModalBlocker as uuiModalBlocker, ModalWindow as uuiModalWindow } from '@epam/uui-components';
import { FlexSpacer, FlexCell } from '../layout';
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
        const width = props.width;
        const height = props.height || 'auto';
        const maxHeight = isMobile() ? 'var(--uui-modals-mobile-max-height)' : (props.maxHeight || 'var(--uui-modals-max-height)');
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

export interface ModalHeaderMods {
    /** Flexbox column gap property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-gap-row-gap-column-gap) */
    columnGap?: number | '6' | '12' | '18' | '24' | '36';
    /** Defines horizontal row padding */
    padding?: '6' | '12' | '18' | '24';
    /** Defines vertical row padding */
    vPadding?: '6' | '9' | '12' | '18' | '24';
    /** Pass true, to enable row bottom border */
    borderBottom?: boolean;
}

export interface ModalHeaderModsOverride {}

export interface ModalHeaderProps extends ModalHeaderCoreProps, Overwrite<ModalHeaderMods, ModalHeaderModsOverride> {}

export function ModalHeader(props: ModalHeaderProps) {
    const style = {
        ...(props.columnGap && { '--uui-modals-header-column-gap': `${props.columnGap}px` }),
        ...(props.padding && { '--uui-modals-header-padding': `${props.padding}px` }),
        ...(props.vPadding && { '--uui-modals-header-vertical-padding': `${props.vPadding}px` }),
    };
    
    return (
        <div
            className={ cx(
                css.root,
                css.modalHeader,
                props.borderBottom && css.borderBottom,
                props.cx,
            ) }
            { ...props.rawProps }
            style={ {
                ...props.rawProps?.style,
                ...style,
            } }
        >
            {props.title && (
                <div className={ cx('uui-modal-title', 'uui-typography') }>
                    {props.title}
                </div>
            )}
            {props.children}
            {props.onClose && <FlexSpacer />}
            {props.onClose && (
                <FlexCell shrink={ 0 } width="auto">
                    <IconButton rawProps={ { 'aria-label': 'Close modal' } } icon={ settings.modal.icons.closeIcon } onClick={ props.onClose } />
                </FlexCell>
            )}
        </div>
    );
}

export interface ModalFooterMods {
    /** Flexbox column gap property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-gap-row-gap-column-gap) */
    columnGap?: number | '6' | '12' | '18' | '24' | '36';
    /** Defines horizontal row padding */
    padding?: '6' | '12' | '18' | '24';
    /** Defines vertical row padding */
    vPadding?: '6' | '9' | '12' | '18' | '24';
    /** Pass true, to enable row top border */
    borderTop?: boolean;
}

export interface ModalFooterModsOverride {}

export interface ModalFooterProps extends ModalFooterCoreProps, Overwrite<ModalFooterMods, ModalFooterModsOverride> {}

export function ModalFooter(props: ModalFooterProps) {
    const style = {
        ...(props.columnGap && { '--uui-modals-footer-column-gap': `${props.columnGap}px` }),
        ...(props.padding && { '--uui-modals-footer-padding': `${props.padding}px` }),
        ...(props.vPadding && { '--uui-modals-footer-vertical-padding': `${props.vPadding}px` }),
    };

    return (
        <div
            className={ cx(
                css.root,
                css.modalFooter,
                props.borderTop && css.borderTop,
                props.cx,
            ) }
            { ...props.rawProps }
            style={ { 
                ...props.rawProps?.style,
                ...style,
            } }
        >
            {props.children}
        </div>
    );
}
