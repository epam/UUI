import React from 'react';
import { PopperArrowProps } from "react-popper";
import './PopoverArrow.scss';

const PopoverArrow = React.forwardRef<HTMLDivElement, PopperArrowProps>(({ style }, ref) => {
    return <div ref={ ref } className='uui-popover-arrow' style={ style }></div>;
});

export default PopoverArrow;
