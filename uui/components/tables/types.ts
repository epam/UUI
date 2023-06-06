import { ControlSize } from '..';

interface BaseRowMods {
    size?: ControlSize | '60';
}

export interface DataTableMods {
    size?: ControlSize;
    border?: boolean;
    headerTextCase?: 'upper' | 'normal';
}

interface TableSizesAndPositionMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataTableRowMods extends TableSizesAndPositionMods {
    borderBottom?: any;
}

export interface DataTableCellMods extends TableSizesAndPositionMods {
    border?: boolean;
}

export interface DataTableHeaderCellMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface DataTableHeaderRowMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}
