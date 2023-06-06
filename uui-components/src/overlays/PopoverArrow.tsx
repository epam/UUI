import React from 'react';
import { PopperArrowProps } from 'react-popper';
import { DropdownPlacement } from '@epam/uui-core';
import './PopoverArrow.module.scss';

interface PopoverArrow {
    arrowProps?: PopperArrowProps;
    placement?: DropdownPlacement;
}

const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrow>(({ arrowProps, placement }, ref) => {
    return <div ref={ ref } className="uui-popover-arrow" style={ arrowProps?.style } data-placement={ placement }></div>;
});

export default PopoverArrow;
