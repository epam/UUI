import { CascadeSelection, DataSourceState } from '../../../../../../types';
import { ITree } from '../../ITree';
import { STRATEGIES } from './constants';

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type TreeStrategyProps<TItem, TId, TFilter = any> = {
    dataSourceState: DataSourceState<TFilter, TId>;
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
};

export interface UseCheckingServiceProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    checked?: TId[];
    getParentId?: (item: TItem) => TId;
    cascadeSelection?: CascadeSelection;
}

export interface CheckingService {

}
