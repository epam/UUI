import * as React from 'react';
import { DataTableRow as uuiDataTableRow } from '@epam/uui-components';
import { withMods, DataTableCellProps, DndActorRenderParams, DataTableRowProps } from '@epam/uui-core';
import { DataTableCell } from './DataTableCell';
import { DataTableRowMods } from './types';
import { DropMarker } from '../';
import css from './DataTableRow.scss';

// Here we define a single instance of the renderCell function to make DataTableRow#shouldComponentUpdate work.
// As we need our mods to style the cell properly, we extract them from DataTableCellProps.rowProps, which is a hack, but it's reliable enough.
export const renderCell = (props: DataTableCellProps) => {
    const mods = props.rowProps as DataTableRowMods & DataTableRowProps;
    return <DataTableCell size={mods.size} {...props} />;
};

export const renderDropMarkers = (props: DndActorRenderParams) => <DropMarker {...props} enableBlocker={true} />;

export const propsMods = { renderCell, renderDropMarkers };

export const DataTableRow = withMods<DataTableRowProps, DataTableRowMods>(
    uuiDataTableRow,
    ({ borderBottom = true, size }) => {
        return [css.root, borderBottom && 'uui-dt-row-border', css['size-' + (size || '36')]];
    },
    () => propsMods
);
