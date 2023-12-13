import { DataTableCellProps } from '@epam/uui-core';
import type { DataTableFocusManager } from './DataTableFocusManager';

export type RowsRegistry<TId> = Map<TId | string, Array<CellProps>>;

export type CellProps = Pick<DataTableCellProps, 'index' | 'key' | 'isReadonly' | 'isDisabled'> & CellActions;

export interface CellActions {
    focus: () => void;
}

export interface RowInfo<TId> {
    id: TId,
    index: number;
}

export type { DataTableFocusManager };
