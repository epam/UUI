import React, { ReactNode } from 'react';
import type { IDropdownBodyProps, IHasCX, IHasRawProps } from '@epam/uui-core';
import { isMobile } from '@epam/uui-core';
import { LinkButton } from '../buttons';
import { DataPickerMobileHeader } from './DataPickerMobileHeader';
import { DropdownContainer } from '../overlays';
import { i18n } from '../../i18n';
import { settings } from '../../settings';

import css from './PickerBodyMobileView.module.scss';

export interface IMobileDropdownWrapperProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IDropdownBodyProps {
    /**
     * Children of the dropdown container.
     */
    children: ReactNode;
    /**
     * Title of the dropdown container.
     */
    title?: string;
    /**
     * Callback for keyboard events.
     */
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    /**
     * Whether to lock focus on the dropdown container.
     */
    focusLock?: boolean;
    /**
     * Width of the dropdown container.
     */
    width?: number | 'auto';
    /**
     * Maximum width of the dropdown container.
     * @default 'auto'
     */
    maxWidth?: number | 'auto';
    /**
     * Maximum height of the dropdown container.
     * @default 'auto'
     */
    maxHeight?: number;
}

export const PickerBodyMobileView: React.FC<IMobileDropdownWrapperProps> = (props) => {
    const isMobileView = isMobile();
    const maxWidth = isMobileView ? 'auto' : props.maxWidth;
    const maxHeight = isMobileView ? 'auto' : props.maxHeight;

    return (
        <DropdownContainer
            { ...props }
            maxWidth={ maxWidth }
            maxHeight={ maxHeight }
            cx={ [css.container, props.cx] }
            autoFocus={ false }
        >
            {isMobileView && <DataPickerMobileHeader title={ props.title } close={ props.onClose } />}

            {props.children}

            {isMobileView && (
                <LinkButton
                    caption={ i18n.pickerInput.doneButton }
                    onClick={ () => props.onClose?.() }
                    cx={ css.done }
                    size={ settings.pickerInput.sizes.body.mobileFooterLinkButton }
                />
            )}
        </DropdownContainer>
    );
};
