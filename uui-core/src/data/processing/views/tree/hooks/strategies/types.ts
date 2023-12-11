import { DataRowOptions, DataSourceState } from '../../../../../../types';
import { STRATEGIES } from './constants';

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type TreeStrategyProps<TItem, TId, TFilter = any> = {
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState: (dataSourceState: DataSourceState<TFilter, TId>) => void;
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;
    getChildCount?(item: TItem): number;
};
