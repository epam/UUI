import * as React from 'react';
import { CX, cx, devLogger, IAdaptiveItem, Icon, IDropdownToggler, IHasCaption, IHasIcon, uuiElement } from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { CountIndicator } from '../../widgets';
import { ReactComponent as SvgTriangle } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import css from './MainMenuButton.module.scss';

interface MainMenuButtonMods {
    /**
    * Defines component type. The primary button leads to the main pages of the site, and the secondary to the others.
    */
    type?: 'primary' | 'secondary';
}

export type MainMenuButtonProps = MainMenuButtonMods & IAdaptiveItem & IDropdownToggler & Omit<ClickableComponentProps, 'isDisabled'>
& IHasIcon & IHasCaption & {
    /**
     * CSS classes to put on the caption
     * @deprecated
     * */
    captionCX?: CX;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /** Count value to be placed in component */
    count?: React.ReactNode;
};

export const MainMenuButton = /* @__PURE__ */React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, MainMenuButtonProps>((props, ref) => {
    if (__DEV__ && props.captionCX) {
        devLogger.warn('MainMenuButton: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    const { type, ...clickableProps } = props;

    return (
        <Clickable
            { ...clickableProps }
            rawProps={ {
                role: 'menuitem',
                'aria-haspopup': props.isDropdown,
                'aria-expanded': props.isOpen,
                ...props.rawProps,
            } }
            cx={ [
                css.root,
                css['type-' + (type || 'primary')],
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
                <div className={ cx(uuiElement.caption, props.captionCX) }>
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
