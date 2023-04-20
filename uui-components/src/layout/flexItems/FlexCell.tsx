import * as React from 'react';
import { isClickableChildClicked, cx, FlexCellProps } from '@epam/uui-core';

export const FlexCell = React.forwardRef<HTMLDivElement, FlexCellProps>((props, ref) => (
    <div
        className={ cx(props.cx) }
        onClick={ props.onClick ? (e) => !isClickableChildClicked(e) && props.onClick(e) : undefined }
        { ...props.rawProps }
        style={ {
            ...props.rawProps?.style,
            minWidth: props.minWidth ? `${props.minWidth}px` : 0,
            flexGrow: props.grow,
            flexShrink: props.shrink,
            flexBasis: props.width ? (props.width === 'auto' || props.width === '100%' ? props.width : `${props.width}px`) : '0',
            textAlign: props.textAlign,
            alignSelf: props.alignSelf,
            ...props.style,
        } }
        ref={ ref }
    >
        {props.children}
    </div>
));

FlexCell.displayName = 'FlexCell';
