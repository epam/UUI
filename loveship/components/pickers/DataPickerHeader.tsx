import React from "react";
import css from "./DataPickerHeader.scss";
import cx from "classnames";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { Text } from "../typography";
import { isMobile } from "@epam/uui";
import { IconButton } from "../buttons";

interface DataPickerHeaderProps {
    title?: string;
    close?: () => void;
}

const DataPickerHeaderImpl: React.FC<DataPickerHeaderProps> = props => {
    if (!isMobile()) return null;

    const size = "48";
    const title = props.title ? props.title.charAt(0).toUpperCase() + props.title.slice(1) : "";
    
    return (
        <div className={ cx(css.header, css[`size-${ size }`]) }>
            <Text font="sans-semibold">{ title }</Text>
            <IconButton
                icon={ closeIcon }
                onClick={ () => props.close?.() }
                cx={ cx(css.close, css[`close-size-${ size }`]) }
            />
        </div>
    );
};

export const DataPickerHeader = React.memo(DataPickerHeaderImpl);