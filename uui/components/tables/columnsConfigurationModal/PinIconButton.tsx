import * as React from 'react';
import { ReactComponent as LockIcon } from '@epam/assets/icons/action-lock-fill.svg';
import { ReactComponent as PinLeftIcon } from '@epam/assets/icons/table-group_column_left-fill.svg';
import { ReactComponent as PinRightIcon } from '@epam/assets/icons/table-group_column_right-fill.svg';
import { IconButton } from '../../buttons';
import { Tooltip } from '../../overlays';
import { i18n } from '../../../i18n';
import { cx, Icon } from '@epam/uui-core';
//
import css from './PinIconButton.module.scss';

type TPinPosition = 'left' | 'right' | undefined;
interface IPinIconButton {
    pinPosition: TPinPosition;
    canUnpin: boolean;
    onTogglePin: (pinPosition: TPinPosition) => void;
}

export function PinIconButton(props: IPinIconButton) {
    const i18nLocal = i18n.tables.columnsConfigurationModal;
    const {
        onTogglePin, pinPosition, canUnpin,
    } = props;
    const isPinned = !!pinPosition;
    const isPinnedAlways = isPinned && !canUnpin;

    let pinUnpinNode: React.ReactNode;

    if (isPinned) {
        const unpinIcon = getUnpinIcon({ isPinnedAlways, pinPosition })!;
        const iconTooltip = isPinnedAlways ? i18nLocal.lockedColumnPinButton : i18nLocal.unPinColumnButton;
        const unpinClickHandler = isPinnedAlways ? undefined : () => onTogglePin(undefined);
        pinUnpinNode = (
            <Tooltip content={ iconTooltip } placement="bottom" color="inverted">
                <IconButton cx={ cx(!isPinnedAlways && css.unpinIcon, css.pinTogglerIcon) } icon={ unpinIcon } onClick={ unpinClickHandler } isDisabled={ isPinnedAlways } color="primary" />
            </Tooltip>
        );
    } else {
        pinUnpinNode = (
            <>
                <Tooltip content={ i18nLocal.pinColumnToTheLeftButton } placement="bottom" color="inverted">
                    <IconButton cx={ css.pinTogglerIcon } icon={ PinLeftIcon } onClick={ () => onTogglePin('left') } isDisabled={ isPinnedAlways } />
                </Tooltip>
                <Tooltip content={ i18nLocal.pinColumnToTheRightButton } placement="bottom" color="inverted">
                    <IconButton cx={ css.pinTogglerIcon } icon={ PinRightIcon } onClick={ () => onTogglePin('right') } isDisabled={ isPinnedAlways } />
                </Tooltip>
            </>
        );
    }

    return pinUnpinNode;
}

function getUnpinIcon(params: { isPinnedAlways: boolean, pinPosition: TPinPosition }): Icon | undefined {
    const { isPinnedAlways, pinPosition } = params;
    if (isPinnedAlways) {
        return LockIcon;
    }
    switch (pinPosition) {
        case 'left': {
            return PinLeftIcon;
        }
        case 'right': {
            return PinRightIcon;
        }
        default: {
            return;
        }
    }
}
