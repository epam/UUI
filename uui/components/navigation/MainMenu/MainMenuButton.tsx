import * as React from 'react';
import {
    IAdaptiveItem,
    ICanBeActive,
    Icon,
    IDropdownToggler,
    IHasCaption,
    IHasIcon,
    useIsActive,
    uuiElement, uuiMod,
} from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { CountIndicator } from '../../widgets/CountIndicator';
import { ReactComponent as SvgTriangle } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import css from './MainMenuButton.module.scss';

interface MainMenuButtonMods {
    /**
    * Defines component type. The primary button leads to the main pages of the site, and the secondary to the others.
    */
    type?: 'primary' | 'secondary';
}

export type MainMenuButtonProps = MainMenuButtonMods & IAdaptiveItem & IDropdownToggler & Omit<ClickableComponentProps, 'isDisabled'>
& IHasIcon & IHasCaption & ICanBeActive & {
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /** Count value to be placed in component */
    count?: React.ReactNode;
};

export const MainMenuButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, MainMenuButtonProps>((props, ref) => {
    const { type, ...clickableProps } = props;

    const { isActive } = useIsActive({
        isLinkActive: props.isLinkActive,
        link: props.link,
        isActive: props.isActive,
    });

    return (
        <Clickable
            { ...clickableProps }
            rawProps={ {
                'aria-expanded': props.isOpen,
                'aria-current': isActive
                    ? 'page'
                    : undefined,
                ...props.rawProps,
            } }
            cx={ [
                css.root,
                css['type-' + (type || 'primary')],
                isActive && uuiMod.active,
                props.cx,
            ] }
            ref={ ref }
        >
            { props.icon && props.iconPosition !== 'right' && (
                <IconContainer
                    icon={ props.icon }
                    onClick={ props.onIconClick }
                />
            ) }
            { props.caption && (
                <div className={ uuiElement.caption }>
                    { props.caption }
                </div>
            ) }
            { props.count !== undefined && props.count !== null && (
                <CountIndicator
                    caption={ props.count }
                    color="neutral"
                    size="18"
                />
            ) }
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ props.onIconClick } />
            ) }
            { props.isDropdown && (
                <IconContainer icon={ SvgTriangle } flipY={ props.isOpen } />
            )}
        </Clickable>
    );
});
