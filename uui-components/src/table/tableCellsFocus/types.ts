import { DataTableCellProps } from '@epam/uui-core';
import type { DataTableFocusManager } from './DataTableFocusManager';

export type RowsRegistry<TId> = Map<TId | string, Array<CellInfo>>;

export interface DataTableFocusManagerProps {
    enableMovementShortcuts?: boolean;
}

export type CellProps = Pick<DataTableCellProps, 'index' | 'key' | 'isReadonly' | 'isDisabled'>;

export interface CellFocusAPI {
    focus: () => void;
}

export interface CellInfo {
    ref: React.RefObject<CellFocusAPI>,
    cellProps: CellProps;
}

export interface RowInfo<TId> {
    id: TId,
    index: number;
}

export type { DataTableFocusManager };
