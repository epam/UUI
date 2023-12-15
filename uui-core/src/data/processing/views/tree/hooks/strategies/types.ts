import { CascadeSelection, DataRowOptions, DataSourceState } from '../../../../../../types';
import { STRATEGIES } from './constants';
import { LazyTreeStrategyProps } from './lazyTree/types';
import { PlainTreeStrategyProps } from './plainTree/types';

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type CommonTreeStrategyProps<TItem, TId, TFilter = any> = {
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;

    getId(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    isFoldedByDefault?(item: TItem): boolean;
    getChildCount?(item: TItem): number;

    cascadeSelection?: CascadeSelection;
};

export type TreeStrategyProps<TItem, TId, TFilter = any> = (
    PlainTreeStrategyProps<TItem, TId, TFilter>
    | LazyTreeStrategyProps<TItem, TId, TFilter>
);
