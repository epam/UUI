import * as React from 'react';
import { Icon, uuiElement, uuiMarkers, IHasIcon, IDropdownToggler, IHasCaption } from '@epam/uui-core';
import { Clickable, ClickableComponentProps } from '../widgets';
import { IconContainer } from '../layout';
import css from './Button.module.scss';

export type ButtonProps = ClickableComponentProps & IDropdownToggler & IHasIcon & IHasCaption & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement> & {
    /** Call to clear toggler value */
    onClear?(e?: any): void;
    /** Icon for clear value button (usually cross) */
    clearIcon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
};

export function Button(props: ButtonProps) {
    return (
        <Clickable
            { ...props }
            rawProps={ {
                'aria-haspopup': props.isDropdown,
                'aria-expanded': props.isOpen,
                ...props.rawProps,
            } }
            cx={ [css.container, props.cx] }
            type="button"
            ref={ props.ref }
        >
            { props.icon && props.iconPosition !== 'right' && (
                <IconContainer
                    icon={ props.icon }
                    onClick={ !props.isDisabled ? props.onIconClick : undefined }
                />
            )}
            { props.caption && (
                <div className={ uuiElement.caption }>
                    { props.caption }
                </div>
            )}
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ !props.isDisabled ? props.onIconClick : undefined } />
            ) }
            { props.isDropdown && (
                <IconContainer icon={ props.dropdownIcon } flipY={ props.isOpen } />
            ) }
            { props.onClear && !props.isDisabled && (
                <IconContainer cx={ uuiMarkers.clickable } icon={ props.clearIcon } onClick={ props.onClear } />
            ) }
        </Clickable>
    );
}
