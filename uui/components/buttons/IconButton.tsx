import * as uuiComponents from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './IconButton.module.scss';
import { systemIcons } from '../../icons/icons';

interface IconButtonMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'neutral';
    /**
     * Defines component size.
     */
    size?: '18' | '24' | '30' | '36';
}

/** Represents the Core properties of the IconButton component. */
export type IconButtonCoreProps = uuiComponents.IconButtonProps;

/** Represents the properties of the IconButton component. */
export type IconButtonProps = Omit<IconButtonCoreProps, 'size'> & IconButtonMods;

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return ['uui-icon_button', `uui-color-${mods.color || 'neutral'}`, css.root];
}

export const IconButton = withMods<Omit<IconButtonCoreProps, 'size'>, IconButtonMods>(
    uuiComponents.IconButton,
    applyIconButtonMods,
    (props) => {
        return {
            dropdownIcon: props.dropdownIcon || systemIcons.foldingArrow,
            size: props.size && Number(props.size),
        };
    },
);
