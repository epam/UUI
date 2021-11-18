import { DataRowProps, DataColumnProps } from "@epam/uui";
import React from "react";
import { ControlSize } from "..";

export interface DataTableCellProps<TItem = any, TId = any> {
    rowProps: DataRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
    role?: React.HTMLAttributes<HTMLElement>['role'];
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
}

interface BaseRowMods {
    size?: ControlSize | '60';
}

export interface DataTableMods {
    size?: ControlSize;
    border?: 'none' | 'night300';
    rowBackground?: 'night50' | 'white' | 'none';
    headerTextCase?: 'upper' | 'normal';
    shadow?: 'dark' | 'white' | false;
}

export interface DataTableRowMods extends DataTableCellMods {
    borderBottom?: 'none' | 'night300';
    background?: 'night50' | 'white' | 'none';
}

export interface DataTableCellMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
    alignActions?: 'top' | 'center';
}

export interface DataTableHeaderCellMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface DataTableHeaderRowMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface ScrollRowMods extends BaseRowMods { }