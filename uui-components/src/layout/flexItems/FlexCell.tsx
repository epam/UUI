import * as React from 'react';
import { isClickableChildClicked, cx, FlexCellProps } from '@epam/uui';

export const FlexCell = React.forwardRef<HTMLDivElement, FlexCellProps>((props, ref) => {
    const style = {
        minWidth: props.minWidth ? `${props.minWidth}px` : 0,
        flexGrow: props.grow,
        flexShrink: props.shrink,
        flexBasis: (props.width === 'auto' || props.width === '100%') ? props.width : `${props.width}px`,
        textAlign: props.textAlign,
        alignSelf: props.alignSelf,
    };

    return (
        <div
            className={ cx(props.cx) }
            onClick={ e => !isClickableChildClicked(e) && props.onClick?.(e) }
            style={ style }
            ref={ ref }
            { ...props.rawProps }
        >
            { props.children }
        </div>
    );
});