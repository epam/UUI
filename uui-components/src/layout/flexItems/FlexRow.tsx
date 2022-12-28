import * as React from 'react';
import css from './FlexRow.scss';
import { FlexRowProps, uuiMarkers, isClickableChildClicked, cx } from '@epam/uui-core';

export const FlexRow = React.forwardRef<HTMLDivElement, FlexRowProps>((props, ref) => {
    const style: React.CSSProperties = {...props.rawProps?.style};
    if (props.columnGap) { style.columnGap = props.columnGap; }
    if (props.rowGap) { style.rowGap = props.rowGap; }

    return (
        <div
            ref={ ref }
            onClick={ props.onClick ? e => !isClickableChildClicked(e) && props.onClick(e) : undefined }
            className={ cx(
                props.cx,
                css.container,
                props.onClick && uuiMarkers.clickable,
                css['align-items-' + (props.alignItems === undefined ? 'center' : props.alignItems)],
            ) }
            { ...props.rawProps }
            style={ style }
        >
            { props.children }
        </div>
    );
});

FlexRow.displayName = 'FlexRow';
