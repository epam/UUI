import { ControlSize } from '..';

interface BaseRowMods {
    size?: ControlSize | '60';
}

export interface DataTableMods {
    size?: ControlSize;
    border?: 'none' | 'night300';
    rowBackground?: 'night50' | 'white' | 'none';
    headerTextCase?: 'upper' | 'normal';
}

interface DataTableSizesAndPositionMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataTableRowMods extends DataTableSizesAndPositionMods {
    borderBottom?: 'none' | 'night300';
    background?: 'night50' | 'white' | 'none';
}

export interface DataTableCellMods extends DataTableSizesAndPositionMods {
    background?: 'night50' | 'fire' | 'sky' | 'grass' | 'sun';
    border?: 'night300';
}

export interface DataTableHeaderCellMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface DataTableHeaderRowMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
}

export interface ScrollRowMods extends BaseRowMods {}
