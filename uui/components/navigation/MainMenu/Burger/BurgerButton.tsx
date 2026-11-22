import React, { type CSSProperties } from 'react';
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
    * Defines components' indent level. Each level adds an extra left padding, e.g. to show nested items.
    * @default 0
    */
    indentLevel?: number;
}

export type BurgerButtonProps = ButtonProps & BurgerButtonMods & ICanBeActive;

function applyBurgerButtonMods(props: BurgerButtonProps) {
    return [
        css.root,
        'uui-main_menu-burger-button',
        css['button-' + (props.type || 'primary')],
        props.isActive && uuiMod.active,
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
            cx={ [applyBurgerButtonMods({ ...props, isActive }), props.cx] }
            rawProps={ {
                ...props.rawProps,
                style: props.indentLevel
                    ? { '--uui-burger_btn-indent-level': `${props.indentLevel}`, ...props.rawProps?.style } as CSSProperties
                    : props.rawProps?.style,
                role: 'menuitem',
            } }
            dropdownIcon={ SvgTriangle }
        />
    );
});
