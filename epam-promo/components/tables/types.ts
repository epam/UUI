import { DataRowProps, DataColumnProps, IHasCX } from "@epam/uui";
import { ControlSize } from "..";

export interface DataTableCellProps<TItem, TId> extends IHasCX {
    rowProps: DataRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
}

interface BaseRowMods {
    size?: ControlSize | '60';
}

export interface DataTableMods {
    size?: ControlSize;
    border?: 'none' | 'gray30';
    headerTextCase?: 'upper' | 'normal';
}

export interface DataTableRowMods extends DataTableCellMods {
    borderBottom?: 'none' | 'gray30';
}

export interface DataTableCellMods {
    size?: ControlSize | '60';
    reusePadding?: 'auto' | 'false';
    padding?: '0' | '12' | '24';
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
}

export interface DataTableHeaderCellMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface DataTableHeaderRowMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface ScrollRowMods extends BaseRowMods { }