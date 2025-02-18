import React, { ReactNode } from 'react';
import { IDropdownBodyProps, IHasCX, IHasRawProps, isMobile } from '@epam/uui-core';
import { LinkButton } from '../buttons';
import { ControlSize } from '../types';
import { DataPickerHeader } from './DataPickerHeader';
import { DropdownContainer } from '../overlays';
import { i18n } from '../../i18n';
import { settings } from '../../index';

import css from './PickerBodyMobileView.module.scss';

export interface IMobileDropdownWrapperProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IDropdownBodyProps {
    children: ReactNode;
    size?: ControlSize;
    title?: string;
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    focusLock?: boolean;
    width?: number | 'auto';
    maxWidth?: number | 'auto';
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
            autoFocus={ true }
        >
            {isMobileView && <DataPickerHeader title={ props.title } close={ props.onClose } />}

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
