import React, { ReactNode } from 'react';
import css from './MobileDropdownWrapper.module.scss';
import { isMobile, useAppMobileHeight } from '@epam/uui-core';
import { LinkButton } from '../buttons';
import { ControlSize } from '../types';
import { DataPickerHeader } from './DataPickerHeader';
import { i18n } from '../../i18n';

interface IMobileDropdownWrapperProps {
    children: ReactNode;
    size?: ControlSize;
    close?: () => void;
    title?: string;
}

export const MobileDropdownWrapper: React.FC<IMobileDropdownWrapperProps> = (props) => {
    const isVisible = isMobile();

    useAppMobileHeight();

    return (
        <>
            {isVisible && <DataPickerHeader title={ props.title } close={ props.close } />}

            {props.children}

            {isVisible && <LinkButton caption={ i18n.pickerInput.doneButton } onClick={ () => props.close?.() } cx={ css.done } size="48" />}
        </>
    );
};
