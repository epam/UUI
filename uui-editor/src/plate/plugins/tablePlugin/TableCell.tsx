import * as React from 'react';
import css from './Table.scss';

import { PlateTableCellElement, useTableStore, useTableColSizes } from '@udecode/plate';

export function TableCell(props: any) {
    const { attributes, element } = props;
    const { get } = useTableStore();

    if (!props.editor) {
        return null;
    }

    let isCellFocused = get.selectedCells()?.includes(element);
    let cellStyles = {
        height: element?.data?.rowSpan ?  `${24 * element?.data?.rowSpan}px` : null,
        background: isCellFocused ? '#B3D7FF' : null,
    };

    return (
        <PlateTableCellElement
            { ...props }
            className={ css.cell }
            { ...attributes }
            style={ element?.data?.style === 'none' ? { display: 'none' } : cellStyles }
            nodeProps={ {
                colSpan: element?.data?.colSpan || 1,
                rowSpan: element?.data?.rowSpan || 1,
            } }
        />
    );
}
