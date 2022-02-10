import { DataRowProps, DataColumnProps, IHasCX } from '@epam/uui';
import { ControlSize } from '..';

export interface DataTableCellProps<TItem, TId> extends IHasCX {
    rowProps: DataRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
    role?: React.HTMLAttributes<HTMLElement>['role'];
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
}

export interface DataTableCellMods {
    size?: ControlSize | '60';
    padding?: '0' | '12' | '24';
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
    alignActions?: 'top' | 'center';
}