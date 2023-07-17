import React from 'react';
import {
    PlateElement,
    PlateElementProps,
} from '@udecode/plate-common';
import { useTableElementState } from '@udecode/plate-table';
import cx from 'classnames';
import css from './Table.module.scss';

const TableElement = React.forwardRef<
    React.ElementRef<typeof PlateElement>,
    PlateElementProps
>(({ className, children, ...props }, ref) => {
    const { colSizes, isSelectingCell, minColumnWidth, marginLeft } =
        useTableElementState();
    // const { props: tableProps, colGroupProps } = useTableElement();

    return (
        <div style={ { paddingLeft: marginLeft } }>
            <PlateElement
                asChild
                ref={ ref }
                className={
                    cx(css.table, className)
                    //     cn(
                    //     isSelectingCell && '[&_*::selection]:bg-none',
                    //     className
                    //   )
                }
                // { ...tableProps }
                { ...props }
            >
                <table>
                    <colgroup
                    // { ...colGroupProps }
                    >
                        { colSizes.map((width, index) => (
                            <col
                                key={ index }
                                style={ {
                                    minWidth: minColumnWidth,
                                    width: width || undefined,
                                } }
                            />
                        )) }
                    </colgroup>

                    <tbody className={ css.tbody }>{ children }</tbody>
                </table>
            </PlateElement>
        </div>
    );
});
TableElement.displayName = 'TableElement';

export { TableElement };
