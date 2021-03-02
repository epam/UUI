import { DataRowProps, DataColumnProps } from "@epam/uui";
import { ControlSize, EpamColor } from "..";

export interface DataTableCellProps<TItem, TId> {
    rowProps: DataRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
}

interface BaseRowMods {
    size?: ControlSize | '60';
}

export interface DataTableMods {
    size?: ControlSize;
    border?: 'none' | 'night300';
    rowBackground?: 'night50' | 'white' | 'none';
    headerTextCase?: 'upper' | 'normal';
}

export interface DataTableRowMods extends DataTableCellMods {
    borderBottom?: 'none' | 'night300';
    background?: 'night50' | 'white' | 'none';
}

export interface DataTableCellMods {
    size?: ControlSize | '60';
    labelColor?: EpamColor;
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