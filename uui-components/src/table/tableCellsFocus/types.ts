import { DataTableCellProps } from '@epam/uui-core';
import type { DataTableFocusManager } from './DataTableFocusManager';

export type RowsRegistry<TId> = Map<TId | string, Array<CellInfo>>;

export interface DataTableFocusManagerProps {}

export type CellProps = Pick<DataTableCellProps, 'index' | 'key' | 'isReadonly' | 'isDisabled'>;

export interface CellFocusAPI {
    focus: () => void;
}

export interface CellInfo {
    ref: React.RefObject<CellFocusAPI>,
    cellProps: CellProps;
}

export type { DataTableFocusManager };
