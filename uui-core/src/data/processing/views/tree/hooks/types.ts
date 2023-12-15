import { ITree } from '../ITree';
import { CheckingService, FocusService, FoldingService, SelectingService } from './services';
import { TreeStrategyProps } from './strategies/types';
import { CascadeSelection, DataRowOptions, DataSourceState } from '../../../../../types';
import { PlainTreeStrategyProps } from './strategies';

type PlainTreeStrategyPropsWithOptionalType<TItem, TId, TFilter = any> = Omit<PlainTreeStrategyProps<TItem, TId, TFilter>, 'type'> & { type?: 'plain' };

export type UseTreeStrategyProps<TItem, TId, TFilter = any> = Exclude<TreeStrategyProps<TItem, TId, TFilter>, { type: 'plain' }>
| PlainTreeStrategyPropsWithOptionalType<TItem, TId, TFilter>;

export type UseTreeProps<TItem, TId, TFilter = any> = UseTreeStrategyProps<TItem, TId, TFilter>;

export interface UseTreeResult<TItem, TId, TFilter = any> extends
    CheckingService<TItem, TId>, FoldingService<TItem, TId>, FocusService, SelectingService<TItem, TId> {

    tree: ITree<TItem, TId>;
    getTreeRowsStats: () => {
        completeFlatListRowsCount: number;
        totalCount: number;
    };

    dataSourceState: DataSourceState<TFilter, TId>;

    getId(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    isFoldedByDefault?(item: TItem): boolean;
    getChildCount?(item: TItem): number;

    cascadeSelection?: CascadeSelection;

    isFetching?: boolean;
    isLoading?: boolean;
}
