import { DataRowProps } from '@epam/uui-core';
import { ControlSize } from '../types';

export interface DataCellMods {
    size?: ControlSize | '60';
}

export interface DataRowAddonsProps<TItem, TId> extends DataCellMods {
    rowProps: DataRowProps<TItem, TId>;
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
}
