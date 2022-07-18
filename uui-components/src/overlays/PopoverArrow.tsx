import React from 'react';
import { IDropdownBody } from "./Dropdown";
import './PopoverArrow.scss';

const PopoverArrow = React.forwardRef<HTMLDivElement, IDropdownBody>(({ arrowProps, placement }, ref) => {
    return <div ref={ ref } className='uui-popover-arrow' style={ arrowProps?.style } data-placement={ placement }></div>;
});

export default PopoverArrow;
