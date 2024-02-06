import * as React from 'react';
import { useMemo, useState } from 'react';
import { ReactComponent as LockIcon } from '../../../icons/action-lock-fill-24.svg';
import { ReactComponent as PinOnIcon } from '../../../icons/action-pin_on-24.svg';
import { ReactComponent as PinOffIcon } from '../../../icons/action-pin_off-24.svg';
import { IconButton } from '../../buttons';
import { Tooltip } from '../../overlays';
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

    const {
        id, onTogglePin, isPinned, canUnpin,
    } = props;
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
    }, [
        isPinnedAlways, isHovered, isPinned,
    ]);

    const pinClickHandler = isPinnedAlways ? undefined : () => onTogglePin(id);

    return (
        <span onMouseOver={ () => setIsHovered(true) } onMouseOut={ () => setIsHovered(false) }>
            <Tooltip content={ tooltipText } placement="bottom" color="inverted">
                <IconButton icon={ pinIcon } onClick={ pinClickHandler } isDisabled={ isPinnedAlways } color={ isPinned ? 'info' : undefined } />
            </Tooltip>
        </span>
    );
}
