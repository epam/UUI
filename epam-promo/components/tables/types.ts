import { ControlSize } from '..';

interface BaseRowMods {
    size?: ControlSize | '60';
}

export interface DataTableMods {
    size?: ControlSize;
    border?: 'none' | 'gray30';
    headerTextCase?: 'upper' | 'normal';
}

interface TableSizesAndPositionMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataTableRowMods extends TableSizesAndPositionMods {
    borderBottom?: 'none' | 'gray30';
    background?: 'white' | 'gray5';
}

export interface DataTableCellMods extends TableSizesAndPositionMods {
    background?: 'gray5' | 'red' | 'blue' | 'green' | 'amber';
    border?: 'gray30';
}

export interface DataTableHeaderCellMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface DataTableHeaderRowMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface ScrollRowMods extends BaseRowMods { }