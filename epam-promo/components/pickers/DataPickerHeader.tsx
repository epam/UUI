import React from "react";
import css from "./DataPickerHeader.scss";
import cx from "classnames";
import closeIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { Text } from "../typography";
import { IconButton } from "../buttons";
import { FlexRow } from "../layout";

interface DataPickerHeaderProps {
    title?: string;
    close?: () => void;
}

const DataPickerHeaderImpl: React.FC<DataPickerHeaderProps> = props => {
    const size = "48";
    const title = props.title ? props.title.charAt(0).toUpperCase() + props.title.slice(1) : "";
    
    return (
        <FlexRow alignItems="center" background="white" borderBottom="gray40" cx={ cx(css.header, css[`size-${ size }`]) }>
            <Text font="sans-semibold">{ title }</Text>
            <IconButton
                icon={ closeIcon }
                onClick={ () => props.close?.() }
                cx={ cx(css.close, css[`close-size-${ size }`]) }
            />
        </FlexRow>
    );
};

export const DataPickerHeader = React.memo(DataPickerHeaderImpl);