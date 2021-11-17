import React from "react";
import css from "./DropdownMenuItem.scss";
import { Text } from "@epam/promo";
import classNames from "classnames";

interface IDropdownMenuItemProps {
    caption: string;
    onClick: () => void;
    isDisabled?: boolean;
}

const DropdownMenuItem: React.FC<IDropdownMenuItemProps> = ({ caption, onClick, isDisabled }) => {
    const wrapperClass = classNames(css.wrapper, {
        [css.disabled]: isDisabled,
    });

    return (
        <div className={ wrapperClass } onClick={ onClick }>
            <Text cx={ isDisabled && css.textDisabled }>{ caption }</Text>
        </div>
    );
};

export default React.memo(DropdownMenuItem);