import { ControlSize } from '../types';

interface BaseRowMods {
    size?: ControlSize | '60';
}

export interface DataTableMods {
    /** Min height of table rows and header */
    size?: ControlSize;
    /** Pass true, to turn row bottom border */
    border?: boolean;
    /** Configure column header text case
     * @default 'normal'
     * */
    headerTextCase?: 'upper' | 'normal';
}

interface TableSizesAndPositionMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataTableRowMods extends TableSizesAndPositionMods {
    borderBottom?: any;
    /**
     * Defines columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
}

export interface DataTableCellMods extends TableSizesAndPositionMods {
    border?: boolean;
    /**
     * Defines table columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
}

export interface DataTableHeaderCellMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
    /**
     * Defines table columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
}

export interface DataTableHeaderRowMods extends BaseRowMods {
    textCase?: 'upper' | 'normal';
    /**
     * Defines table columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
}
