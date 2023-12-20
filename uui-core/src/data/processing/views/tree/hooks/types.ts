import { CheckingService, FocusService, FoldingService, SelectingService } from './services';
import { ITree } from '../../tree/ITree';
import { CommonDataSourceConfig, TreeActions, TreeLoadingState, TreeRowsStats } from './strategies/types';

export interface UseTreeResult<TItem, TId, TFilter = any> extends
    CheckingService<TItem, TId>,
    FoldingService<TItem, TId>,
    FocusService,
    SelectingService<TItem, TId>,
    CommonDataSourceConfig<TItem, TId, TFilter>,
    TreeLoadingState,
    TreeActions,
    TreeRowsStats {

    tree: ITree<TItem, TId>;
}
