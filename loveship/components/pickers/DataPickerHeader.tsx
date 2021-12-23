import React from "react";
import css from "./DataPickerHeader.scss";
import { ReactComponent as CloseIcon } from "@epam/assets/icons/common/navigation-close-24.svg";
import { Text } from "../typography";
import { isMobile } from "@epam/uui";
import { IconButton } from "../buttons";
import { FlexRow } from "../layout";

interface DataPickerHeaderProps {
    title?: string;
    close?: () => void;
}

const DataPickerHeaderImpl: React.FC<DataPickerHeaderProps> = props => {
    if (!isMobile()) return null;

    const title = props.title ? props.title.charAt(0).toUpperCase() + props.title.slice(1) : "";
    
    return (
        <FlexRow alignItems="center" size="48" background="white" borderBottom="night400" cx={ css.header }>
            <Text font="sans-semibold">{ title }</Text>
            <IconButton
                icon={ CloseIcon }
                onClick={ () => props.close?.() }
                cx={ css.close }
            />
        </FlexRow>
    );
};

export const DataPickerHeader = React.memo(DataPickerHeaderImpl);