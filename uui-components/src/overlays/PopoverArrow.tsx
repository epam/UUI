import React from 'react';
import { PopperArrowProps } from 'react-popper';
import { DropdownPlacement } from '@epam/uui-core';
import './PopoverArrow.module.scss';

interface IPopoverArrow {
    arrowProps?: PopperArrowProps;
    placement?: DropdownPlacement;
}

const PopoverArrow = /* @__PURE__ */React.forwardRef<HTMLDivElement, IPopoverArrow>(({ arrowProps, placement }, ref) => {
    return <div ref={ ref } className="uui-popover-arrow" style={ arrowProps?.style } data-placement={ placement }></div>;
});

export default PopoverArrow;
