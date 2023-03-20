import * as React from 'react';
import css from './Table.scss';

import { PlateTableCellElement } from '@udecode/plate';

export function TableCell(props: any) {
    const { attributes, element } = props;

    if (!props.editor) {
        return null;
    }

    return (
        <PlateTableCellElement
            { ...props }
            className={ css.cell }
            { ...attributes }
            nodeProps={ {
                colSpan: element?.data?.colSpan || 1,
                rowSpan: element?.data?.rowSpan || 1,
            } }
        />
    );
}
