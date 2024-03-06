import * as React from 'react';
import { IDropdownToggler, Icon } from '@epam/uui-core';
import { Clickable, ClickableComponentProps } from '../widgets';
import { IconContainer } from '../layout';
import css from './IconButton.module.scss';
import { ReactComponent as foldingArrow } from '@epam/assets/icons/navigation-chevron_down-outline.svg';

export type IconButtonProps = ClickableComponentProps & IDropdownToggler & {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
};

export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>((props, ref) => {
    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : foldingArrow;

    return (
        <Clickable
            { ...props }
            type="button"
            cx={ [css.container, props.cx] }
            ref={ ref }
        >
            <IconContainer icon={ props.icon } />
            { props.isDropdown && (
                <IconContainer icon={ DropdownIcon } flipY={ props.isOpen } />
            ) }
        </Clickable>
    );
});
