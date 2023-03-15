import * as React from 'react';
import cx from 'classnames';

import { PlateTableRowElement } from '@udecode/plate';

import css from './Table.scss';

export function TableRow(props: any) {

    const isHeaderRow = () => {
        return props.element.children[0]?.type === 'th';
    };

    const { attributes, children } = props;
    return <PlateTableRowElement
        { ...attributes }
        { ...props }
        className={ cx(css.row, isHeaderRow() && css.headerRow) }
    >
        { children }
    </PlateTableRowElement>;
}
