import React, { ReactNode } from 'react';
import css from './MobileDropdownWrapper.module.scss';
import { IDropdownBodyProps, IHasCX, IHasRawProps, isMobile } from '@epam/uui-core';
import { LinkButton } from '../buttons';
import { ControlSize } from '../types';
import { DataPickerHeader } from './DataPickerHeader';
import { DropdownContainer } from '../overlays';
import { i18n } from '../../i18n';

interface IMobileDropdownWrapperProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IDropdownBodyProps {
    children: ReactNode;
    size?: ControlSize;
    title?: string;
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
    focusLock?: boolean;
    width?: number;
}

export const MobileDropdownWrapper: React.FC<IMobileDropdownWrapperProps> = (props) => {
    const isMobileView = isMobile();

    return (
        <DropdownContainer
            { ...props }
            cx={ [css.container, props.cx] }
            rawProps={ props.rawProps }
            onKeyDown={ props.onKeyDown }
            focusLock={ props.focusLock }
            width={ props.width }
        >
            {isMobileView && <DataPickerHeader title={ props.title } close={ props.onClose } />}

            {props.children}

            {isMobileView && <LinkButton caption={ i18n.pickerInput.doneButton } onClick={ () => props.onClose?.() } cx={ css.done } size="48" />}
        </DropdownContainer>
    );
};
