import * as React from 'react';
import type { Icon } from '@epam/uui-core';
import { cx } from '@epam/uui-core';
import { IconButton } from '../../buttons';
import { Tooltip } from '../../overlays';
import { i18n } from '../../../i18n';
import { settings } from '../../../settings';

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
            <Tooltip
                content={ iconTooltip }
                placement="bottom"
                color="inverted"
            >
                <IconButton
                    cx={ cx(!isPinnedAlways && css.unpinIcon, css.pinTogglerIcon) }
                    icon={ unpinIcon }
                    onClick={ unpinClickHandler }
                    isDisabled={ isPinnedAlways }
                    color="primary"
                    rawProps={ {
                        'aria-description': iconTooltip,
                        'aria-label': 'Unpin Button',
                    } }
                />
            </Tooltip>
        );
    } else {
        pinUnpinNode = (
            <>
                <Tooltip
                    content={ i18nLocal.pinColumnToTheLeftButton }
                    placement="bottom"
                    color="inverted"
                >
                    <IconButton
                        cx={ css.pinTogglerIcon }
                        icon={ settings.dataTable.icons.columnsConfigurationModal.pinLeftIcon }
                        onClick={ () => onTogglePin('left') }
                        isDisabled={ isPinnedAlways }
                        rawProps={ {
                            'aria-description': i18nLocal.pinColumnToTheLeftButton,
                            'aria-label': 'Pin left button',
                        } }
                    />
                </Tooltip>
                <Tooltip
                    content={ i18nLocal.pinColumnToTheRightButton }
                    placement="bottom"
                    color="inverted"
                >
                    <IconButton
                        cx={ css.pinTogglerIcon }
                        icon={ settings.dataTable.icons.columnsConfigurationModal.pinRightIcon }
                        onClick={ () => onTogglePin('right') }
                        isDisabled={ isPinnedAlways }
                        rawProps={ {
                            'aria-description': i18nLocal.pinColumnToTheRightButton,
                            'aria-label': 'Pin right button',
                        } }
                    />
                </Tooltip>
            </>
        );
    }

    return pinUnpinNode;
}

function getUnpinIcon(params: { isPinnedAlways: boolean, pinPosition: TPinPosition }): Icon | undefined {
    const { isPinnedAlways, pinPosition } = params;
    if (isPinnedAlways) {
        return settings.dataTable.icons.columnsConfigurationModal.lockIcon;
    }
    switch (pinPosition) {
        case 'left': {
            return settings.dataTable.icons.columnsConfigurationModal.pinLeftIcon;
        }
        case 'right': {
            return settings.dataTable.icons.columnsConfigurationModal.pinRightIcon;
        }
        default: {
            return;
        }
    }
}
