import { IconButton } from "../../../.";
import * as React from "react";
import { ReactComponent as LockIcon } from "@epam/assets/icons/common/action-lock-fill-18.svg";
import { ReactComponent as PinOnIcon } from "@epam/assets/icons/common/action-pin_on-18.svg";
import { ReactComponent as PinOffIcon } from "@epam/assets/icons/common/action-pin_off-18.svg";
import { useMemo, useState } from "react";

interface IPinIconButton {
    isPinned: boolean;
    canUnpin: boolean;
    onTogglePin: (id: string) => void;
    id: string;
}

export function PinIconButton(props: IPinIconButton) {
    const { id, onTogglePin, isPinned, canUnpin } = props;
    const [isHovered, setIsHovered] = useState(false);
    const isPinnedAlways = isPinned && !canUnpin;
    const pinIcon = useMemo(() => {
        if (isPinnedAlways) {
            return LockIcon;
        }
        if (isPinned) {
            return isHovered ? PinOffIcon : PinOnIcon;
        }
        return PinOnIcon;
    }, [isPinnedAlways, isHovered, isPinned]);
    const pinClickHandler = isPinnedAlways ? undefined : () => onTogglePin(id);

    return (
        <span onMouseOver={ () => setIsHovered(true) } onMouseOut={ () => setIsHovered(false) }>
            <IconButton
                icon={ pinIcon }
                onClick={ pinClickHandler }
                isDisabled={ isPinnedAlways }
                color={ isPinned ? 'sky' : undefined }
            />
        </span>
    );
}
