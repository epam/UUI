import React from 'react';
import { PopperArrowProps } from 'react-popper';
import { cx, DropdownPlacement } from '@epam/uui-core';
import css from './PopoverArrow.module.scss';

interface IPopoverArrow extends React.RefAttributes<HTMLDivElement> {
    arrowProps?: PopperArrowProps;
    placement?: DropdownPlacement;
}

const PopoverArrow = ({ arrowProps, placement, ref }: IPopoverArrow) => {
    return <div ref={ ref } className={ cx('uui-popover-arrow', css.root) } style={ arrowProps?.style } data-placement={ placement }></div>;
};

export default PopoverArrow;
