import React from 'react';
import { DropdownPlacement } from "./Dropdown";
import './PopoverArrow.scss';
import { PopperArrowProps } from 'react-popper';

interface PopoverArrow {
    arrowProps?: PopperArrowProps;
    placement?: DropdownPlacement;
}

const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrow>(({ arrowProps, placement }, ref) => {
    return <div ref={ ref } className='uui-popover-arrow' style={ arrowProps?.style } data-placement={ placement }></div>;
});

export default PopoverArrow;
