import * as React from 'react';
import { TableCellRenderer } from './TableCellRenderer';

export function TableCell(props: any) {
    const { attributes, element } = props;

    // isNan check needed here
    const attrColSpan = isNaN(element.attributes?.colspan) ? 1 : Number(element.attributes?.colspan);
    const attrRowSpan = isNaN(element.attributes?.rowspan) ? 1 : Number(element.attributes?.rowspan);

    const appliedSpans = {
        colSpan: element?.data?.colSpan ?? attrColSpan,
        rowSpan: element?.data?.rowSpan ?? attrRowSpan,
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
            style={ element.data?.merged ? { display: 'none' } : undefined }
        />
    );
}
