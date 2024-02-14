import * as React from 'react';
import { Icon, IDropdownToggler } from '@epam/uui-core';
import css from './IconButton.module.scss';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';

/** Represents the Core properties of the IconButton component. */
export interface IconButtonCoreProps extends ClickableComponentProps, IDropdownToggler {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
}

interface IconButtonMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'neutral';
}

/** Represents the properties of the IconButton component. */
export type IconButtonProps = IconButtonCoreProps & IconButtonMods;

export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>((props, ref) => {
    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : systemIcons.foldingArrow;

    return (
        <Clickable
            { ...props }
            type="button"
            cx={ [
                css.root,
                'uui-icon_button',
                `uui-color-${props.color || 'neutral'}`,
                props.cx,
            ] }
            ref={ ref }
        >
            <IconContainer icon={ props.icon } />
            { props.isDropdown && (
                <IconContainer icon={ DropdownIcon } flipY={ props.isOpen } />
            ) }
        </Clickable>
    );
});
