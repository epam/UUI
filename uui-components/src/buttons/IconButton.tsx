import * as React from 'react';
import { IDropdownToggler, Icon } from '@epam/uui-core';
import { Clickable, ClickableComponentProps } from '../widgets';
import { IconContainer } from '../layout';
import css from './IconButton.module.scss';

export type IconButtonProps = ClickableComponentProps & Omit<IDropdownToggler, 'isDropdown'> & {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /**
     * Defines component size.
     */
    size?: number | string;
    /**
     * Pass true to enable dropdown icon.
     */
    showDropdownIcon?: boolean;

    /** Rotate the icon (cw stands for 'clock-wise', ccw stands for 'counter clock-wise')) */
    rotate?: '0' | '90cw' | '180' | '90ccw';

    /** Flips the icon vertically */
    flipY?: boolean;

    /** Called when keyDown event is fired on component */
    onKeyDown?: (e: React.KeyboardEvent) => void;
};

export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>((props, ref) => {
    return (
        <Clickable
            { ...props }
            type="button"
            cx={ [css.container, props.cx] }
            ref={ ref }
        >
            <IconContainer icon={ props.icon } size={ props.size } flipY={ props.flipY } rotate={ props.rotate } />
            { props.showDropdownIcon && (
                <IconContainer icon={ props.dropdownIcon } size={ props.size } />
            ) }
        </Clickable>
    );
});
