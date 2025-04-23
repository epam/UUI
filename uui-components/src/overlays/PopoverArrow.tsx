import React from 'react';
import { FloatingArrowProps } from '@floating-ui/react';
import { cx, DropdownPlacement } from '@epam/uui-core';
import css from './PopoverArrow.module.scss';

interface IPopoverArrow {
    arrowProps?: Omit<FloatingArrowProps, 'ref' | 'context'> & React.ComponentPropsWithRef<'div'>;
    placement?: DropdownPlacement;
}

const PopoverArrow = React.forwardRef<HTMLDivElement, IPopoverArrow>(({ arrowProps, placement }, ref) => {
    return <div ref={ ref } className={ cx('uui-popover-arrow', css.root) } style={ arrowProps?.style } data-placement={ placement }></div>;
});

export default PopoverArrow;
