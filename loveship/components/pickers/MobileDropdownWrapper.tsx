import React, { ReactNode } from "react";
import css from "./MobileDropdownWrapper.scss";
import { isMobile } from "@epam/uui";
import { LinkButton } from "../buttons";
import { ControlSize } from "../types";
import { DataPickerHeader } from "./DataPickerHeader";

interface IMobileDropdownWrapperProps {
    children: ReactNode;
    size?: ControlSize;
    close?: () => void;
    title?: string;
}

export const MobileDropdownWrapper: React.FC<IMobileDropdownWrapperProps> = props => {
    const isVisible = isMobile();
    
    return (
        <>
            { isVisible && <DataPickerHeader title={ props.title } close={ props.close }/> }

            { props.children }

            { isVisible && (
                <LinkButton
                    caption="DONE"
                    onClick={ () => props.close?.() }
                    cx={ css.done }
                    size={ props.size }
                />
            ) }
        </>
    );
};