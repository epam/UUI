import React from 'react';
import { PopperArrowProps } from 'react-popper';
import { cx, DropdownPlacement } from '@epam/uui-core';
import css from './PopoverArrow.module.scss';

interface IPopoverArrow {
    arrowProps?: PopperArrowProps;
    placement?: DropdownPlacement;
}

const PopoverArrow = React.forwardRef<HTMLDivElement, IPopoverArrow>(({ arrowProps, placement }, ref) => {
    return <div ref={ ref } className={ cx('uui-popover-arrow', css.root) } style={ arrowProps?.style } data-placement={ placement }></div>;
});

export default PopoverArrow;
