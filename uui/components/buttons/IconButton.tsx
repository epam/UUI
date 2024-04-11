import * as uuiComponents from '@epam/uui-components';
import { createSkinComponent } from '@epam/uui-core';
import css from './IconButton.module.scss';
import { systemIcons } from '../../icons/icons';

interface IconButtonMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'neutral';
}

/** Represents the Core properties of the IconButton component. */
export type IconButtonCoreProps = Omit<uuiComponents.IconButtonProps, 'size'> & {
    /**
     * Defines component size.
     */
    size?: '18' | '24' | '30' | '36';
};

/** Represents the properties of the IconButton component. */
export type IconButtonProps = IconButtonCoreProps & IconButtonMods;

function applyIconButtonMods(props: IconButtonProps) {
    return ['uui-icon_button', `uui-color-${props.color || 'neutral'}`, css.root];
}

export const IconButton = /* @__PURE__ */createSkinComponent<uuiComponents.IconButtonProps, IconButtonProps>(
    uuiComponents.IconButton,
    (props) => {
        return {
            dropdownIcon: props.dropdownIcon || systemIcons.foldingArrow,
            size: props.size && Number(props.size),
        };
    },
    applyIconButtonMods,
);
