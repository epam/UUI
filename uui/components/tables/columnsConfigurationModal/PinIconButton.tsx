import { IconButton, Tooltip } from '../../../.';
import * as React from 'react';
import { ReactComponent as LockIcon } from '@epam/assets/icons/common/action-lock-fill-18.svg';
import { ReactComponent as PinOnIcon } from '@epam/assets/icons/common/action-pin_on-18.svg';
import { ReactComponent as PinOffIcon } from '@epam/assets/icons/common/action-pin_off-18.svg';
import { useMemo, useState } from 'react';
import { i18n } from '../../../i18n';

interface IPinIconButton {
    isPinned: boolean;
    canUnpin: boolean;
    onTogglePin: (id: string) => void;
    id: string;
}

const i18nLocal = i18n.tables.columnsConfigurationModal;

export function PinIconButton(props: IPinIconButton) {
    const [isHovered, setIsHovered] = useState(false);

    const { id, onTogglePin, isPinned, canUnpin } = props;
    const isPinnedAlways = isPinned && !canUnpin;

    const tooltipText = useMemo(() => {
        if (isPinned) {
            return isPinnedAlways ? i18nLocal.lockedColumnPinButton : i18nLocal.unPinColumnButton;
        }
        return i18nLocal.pinColumnButton;
    }, [isPinned, isPinnedAlways]);

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
        <span onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}>
            <Tooltip content={tooltipText} placement="bottom" color="contrast">
                <IconButton icon={pinIcon} onClick={pinClickHandler} isDisabled={isPinnedAlways} color={isPinned ? 'info' : undefined} />
            </Tooltip>
        </span>
    );
}
