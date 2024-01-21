import * as React from 'react';
import {
    CX, cx, devLogger, IAdaptiveItem, IAnalyticableClick, ICanRedirect, IClickable, Icon, IDropdownToggler,
    IHasCaption, IHasCX, IHasIcon, IHasTabIndex, uuiElement,
} from '@epam/uui-core';
import { Clickable, IconContainer, UnionRawProps } from '@epam/uui-components';
import { CountIndicator } from '../../widgets';
import { ReactComponent as SvgTriangle } from '../../../icons/chevron-down-24.svg';
import css from './MainMenuButton.module.scss';

interface MainMenuButtonMods {
    /**
    * Defines component type. The primary button leads to the main pages of the site, and the secondary to the others.
    */
    type?: 'primary' | 'secondary';
}

export type MainMenuButtonProps = MainMenuButtonMods & IAdaptiveItem & IClickable & IAnalyticableClick & IHasTabIndex
& IHasCX & ICanRedirect & UnionRawProps & IDropdownToggler & IHasIcon & IHasCaption & {
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

export const MainMenuButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, MainMenuButtonProps>((props, ref) => {
    if (__DEV__ && props.captionCX) {
        devLogger.warn('MainMenuButton: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    return (
        <Clickable
            { ...props }
            rawProps={ {
                role: 'menuitem',
                'aria-haspopup': props.isDropdown,
                'aria-expanded': props.isOpen,
                ...props.rawProps as UnionRawProps,
            } }
            cx={ [
                css.root,
                css['type-' + (props.type || 'primary')],
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
