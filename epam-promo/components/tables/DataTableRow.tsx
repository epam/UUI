import * as React from 'react';
import { DataTableRow as uuiDataTableRow, DataTableRowProps } from '@epam/uui-components';
import { withMods, DataTableCellProps, DndActorRenderParams } from '@epam/uui';
import { DataTableCell } from './DataTableCell';
import { DataTableRowMods } from './types';
import { DropMarker } from '../';
import * as css from './DataTableRow.scss';

// Here we define a single instance of the renderCell function to make DataTableRow#shouldComponentUpdate work.
// As we need our mods to style the cell properly, we extract them from DataTableCellProps.rowProps, which is a hack, but it's reliable enough.
export const renderCell = (props: DataTableCellProps<any, any>) => {
    const mods = props.rowProps as DataTableRowMods & DataTableRowProps<any, any>;
    const isFirstColumn = props.index === 0;
    const isLastColumn = !props.rowProps.columns || props.index === props.rowProps.columns.length - 1;
    return <DataTableCell
        key={ props.column.key }
        size={ mods.size }
        { ...props }
        reusePadding={ mods.reusePadding || 'auto' }
        isFirstColumn={ isFirstColumn }
        isLastColumn={ isLastColumn }
    />;
};

export const renderDropMarkers = (props: DndActorRenderParams) => <DropMarker { ...props } enableBlocker={ true } />;

export const propsMods = { renderCell, renderDropMarkers };

export const DataTableRow = withMods<DataTableRowProps<any, any>, DataTableRowMods>(
    uuiDataTableRow,
    (mods: DataTableRowMods) => [
        css.root,
        css['border-' + (mods.borderBottom || 'gray30')],
        css['size-' + (mods.size || '30')],
    ],
    (mods: DataTableRowMods) => propsMods,
);
