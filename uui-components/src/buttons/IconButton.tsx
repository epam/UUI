import * as React from 'react';
import { IDropdownToggler, Icon } from '@epam/uui-core';
import { Clickable, ClickableComponentProps } from '../widgets';
import { IconContainer } from '../layout';
import css from './IconButton.module.scss';

export type IconButtonProps = ClickableComponentProps & IDropdownToggler & {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /**
     * Defines component size.
     */
    size?: number;
};

export const IconButton = /* @__PURE__ */React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>((props, ref) => {
    const size = props.size && Number(props.size);
    return (
        <Clickable
            { ...props }
            type="button"
            cx={ [css.container, props.cx] }
            ref={ ref }
        >
            <IconContainer icon={ props.icon } size={ size } />
            { props.isDropdown && (
                <IconContainer icon={ props.dropdownIcon } flipY={ props.isOpen } size={ size } />
            ) }
        </Clickable>
    );
});
