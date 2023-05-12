import * as React from 'react';
import { TableCellRenderer } from './TableCellRenderer';

export function TableCell(props: any) {
    const { attributes, element } = props;

    const appliedSpans = {
        colSpan: element?.data?.colSpan || Number(element.attributes?.colspan) || 1,
        rowSpan: element?.data?.rowSpan || Number(element.attributes?.rowspan) || 1,
    };
    // needs for getColIndex function
    // TODO: think about, should we store colSpan in element
    element.colSpan = appliedSpans.colSpan;


    if (!props.editor) {
        return null;
    }

    return (
        <TableCellRenderer
            { ...props }
            { ...attributes }
            nodeProps={ appliedSpans }
        />
    );
}
