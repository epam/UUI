import { ControlSize } from '..';

export interface DataTableCellMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
    alignActions?: 'top' | 'center';
}
