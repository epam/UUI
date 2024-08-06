import * as React from 'react';
import { DataColumnProps, IClickable, IHasCX, IHasRawProps } from '@epam/uui-core';
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
    shrink?: number;
    style?: React.CSSProperties;
}
 
export const DataTableCellContainer = React.forwardRef<HTMLDivElement, DataTableCellContainerProps>((props: DataTableCellContainerProps, ref) => {
    return (
        <FlexCell
            { ...props.column }
            minWidth={ props.column.width }
            rawProps={ props.rawProps }
            cx={ ['uui-dt-vars', css.cell, props.column.cx, props.cx] }
            onClick={ props.onClick }
            textAlign={ props.textAlign }
            alignSelf={ props.alignSelf }
            shrink={ props.shrink }
            ref={ ref }
            style={ props.style }
        >
            { props.children }
        </FlexCell>
    );
});
