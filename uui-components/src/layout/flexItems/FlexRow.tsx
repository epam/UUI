import * as React from 'react';
import css from './FlexRow.module.scss';
import {
    FlexRowProps, uuiMarkers, isEventTargetInsideClickable, cx,
} from '@epam/uui-core';

export const FlexRow = /* @__PURE__ */React.forwardRef<HTMLDivElement, FlexRowProps>((props, ref) => (
    <div
        ref={ ref }
        onClick={ props.onClick ? (e) => !isEventTargetInsideClickable(e) && props.onClick(e) : undefined }
        className={ cx(
            'uui-flex-row',
            props.cx,
            css.container,
            props.onClick && uuiMarkers.clickable,
            css['align-items-' + (props.alignItems === undefined ? 'center' : props.alignItems)],
            props?.justifyContent && css[`justify-content-${props.justifyContent}`],
        ) }
        { ...props.rawProps }
        style={ {
            columnGap: props.columnGap && `${props.columnGap}px`,
            rowGap: props.rowGap && `${props.rowGap}px`,
            ...props.rawProps?.style,
        } }
    >
        {props.children}
    </div>
));

FlexRow.displayName = 'FlexRow';
