import * as React from 'react';
import { isEventTargetInsideClickable, cx, FlexCellProps } from '@epam/uui-core';

export const FlexCell = React.forwardRef<HTMLDivElement, FlexCellProps>((props, ref) => {
    const actualStyle = {
        ...props.rawProps?.style,
        minWidth: props.minWidth ? `${props.minWidth}px` : 0,
        flexGrow: props.grow,
        flexShrink: props.shrink,
        flexBasis: props.width ? (props.width === 'auto' || props.width === '100%' ? props.width : `${props.width}px`) : '0',
        textAlign: props.textAlign,
        alignSelf: props.alignSelf,
        ...props.style,
    };
    return (
        <div
            className={ cx(props.cx) }
            onClick={ props.onClick ? (e) => !isEventTargetInsideClickable(e) && props.onClick(e) : undefined }
            { ...props.rawProps }
            style={ actualStyle }
            ref={ ref }
        >
            {props.children}
        </div>
    );
});
