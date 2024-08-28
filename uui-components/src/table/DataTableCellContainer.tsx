import * as React from 'react';
import { DataColumnProps, IClickable, IHasCX, IHasRawProps } from '@epam/uui-core';
import { FlexCell } from '../layout';

import css from './DataTableCellContainer.module.scss';

/**
 * Props for DataTableCellContainer component.
 */
export interface DataTableCellContainerProps extends
    IHasCX,
    IClickable,
    React.PropsWithChildren,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /**
     * DataTable column configuration.
     */
    column: DataColumnProps;
    /**
     * CSS text-align property.
     */
    textAlign?: 'left' | 'center' | 'right';
    /**
     * Flexbox align-self property. Aligns items vertically for horizontal flexbox. [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-align-self)
     */
    alignSelf?: string;
    /**
     * Flexbox shrink property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-flex-shrink).
     */
    shrink?: number;
    /**
     * Standard style attribute. Styles are added to element style, overriding supplied flex styles.
     */
    style?: React.CSSProperties;
}

export const DataTableCellContainer = React.forwardRef<HTMLDivElement, DataTableCellContainerProps>((props: DataTableCellContainerProps, ref) => {
    return (
        <FlexCell
            { ...props.column }
            minWidth={ props.column.width }
            rawProps={ props.rawProps }
            cx={ ['uui-dt-vars', css.root, props.column.cx, props.cx] }
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
