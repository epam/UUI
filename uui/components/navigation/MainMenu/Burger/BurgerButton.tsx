import React from 'react';
import { IHasIcon, IDropdownToggler, ICanBeActive, useIsActive, uuiMod } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { ReactComponent as SvgTriangle } from '@epam/assets/icons/navigation-arrow_down-outline.svg';
import css from './BurgerButton.module.scss';

interface BurgerButtonMods extends IHasIcon, IDropdownToggler {
    /*
    * Defines component type.
    */
    type?: 'primary' | 'secondary';
    /*
    * Defines components' indent.
    */
    indentLevel?: number;
}

export type BurgerButtonProps = ButtonProps & BurgerButtonMods & ICanBeActive;

function applyBurgerButtonMods(props: BurgerButtonProps) {
    return [
        css.root,
        'uui-main_menu-burger-button',
        css['button-' + (props.type || 'primary')],
        css['indent-' + (props.indentLevel || 0)],
        props.isActive && uuiMod.active,
        props.isDropdown && css.dropdown,
        props.icon && css.hasIcon,
    ];
}

export const BurgerButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, BurgerButtonProps>((props, ref) => {
    const { isActive } = useIsActive({
        isLinkActive: props.isLinkActive,
        link: props.link,
        isActive: props.isActive,
    });

    return (
        <Button
            { ...props }
            ref={ ref }
            cx={ applyBurgerButtonMods({ ...props, isActive }) }
            rawProps={ {
                ...props.rawProps,
                role: 'menuitem',
            } }
            dropdownIcon={ SvgTriangle }
        />
    );
});
