import { DataSourceState } from '../../../../../../types';
import { STRATEGIES } from './constants';

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type TreeStrategyProps<TItem, TId, TFilter = any> = {
    dataSourceState: DataSourceState<TFilter, TId>;
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
};
