import * as React from 'react';
import { cx, DataColumnProps, IClickable, IHasCX, IHasRawProps } from '@epam/uui-core';
import { FlexCell } from '../layout';
import css from './DataTableCellContainer.module.scss';
 
/**
 * Header cell props of DataTable with Timeline.
 */
export interface DataTableCellContainerProps extends
    IHasCX,
    IClickable,
    React.PropsWithChildren,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    column: DataColumnProps;
    textAlign?: 'left' | 'center' | 'right';
    alignSelf?: string;
    style?: React.CSSProperties;
    ref?: React.RefObject<HTMLDivElement> | React.RefCallback<HTMLDivElement>;
}
 
export function DataTableCellContainer(props: DataTableCellContainerProps) {
    return (
        <FlexCell
            { ...props.column }
            minWidth={ props.column.width }
            rawProps={ props.rawProps }
            cx={
                cx(
                    'uui-dt-vars',
                    css.cell,
                    props.column.cx,
                    props.cx,
                ) 
            }
            onClick={ props.onClick }
            textAlign={ props.textAlign }
            alignSelf={ props.alignSelf }
            ref={ props.ref }
            style={ props.style }
        >
            { props.children }
        </FlexCell>
    );
}
