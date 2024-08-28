import { ControlSize } from '../types';

export interface DataTableModsOverride {}

export interface DataTableMods {
    /**
     *  Min height of table rows and header
     *  @default '36'
     * */
    size?: ControlSize;
    /** Pass true, to turn row bottom border */
    border?: boolean;
    /** Configure column header text case
     * @default 'normal'
     * */
    headerTextCase?: 'upper' | 'normal';
    /**
     * Defines table header size
     * @default '36'
     * */
    headerSize?: '36' | '48' | '60';
    /**
     * Defines table columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
}

interface TableSizesAndPositionMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataTableRowMods extends TableSizesAndPositionMods {
    borderBottom?: boolean;
    /**
     * Defines columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
}

export interface DataTableCellMods extends Omit<TableSizesAndPositionMods, 'padding'> {
    border?: boolean;
    /**
     * Defines table columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
}

export interface DataTableHeaderCellMods {
    textCase?: 'upper' | 'normal';
    /**
     * Defines table columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
    size?: DataTableMods['headerSize'];
}

export interface DataTableHeaderRowMods {
    textCase?: 'upper' | 'normal';
    /**
     * Defines table columns gap size
     * @default '24'
     * */
    columnsGap?: '12' | '24';
    size?: DataTableMods['headerSize'];
}
