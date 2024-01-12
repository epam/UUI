import { UseTreeResult } from '../../..';
import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { LazyDataSourceApi, SortingOption } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';

export type Modes = typeof MODES[keyof typeof MODES];

export const MODES = {
    server: 'server',
    client: 'client',
} as const;

export interface ServerAsyncTreeProps<TItem, TId, TFilter> extends CommonDataSourceConfig<TItem, TId, TFilter> {
    mode: typeof MODES.server,
    api: LazyDataSourceApi<TItem, TId, TFilter>;

    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];
}

export interface ClientAsyncTreeProps<TItem, TId, TFilter> extends
    CommonDataSourceConfig<TItem, TId, TFilter> {

    mode: 'client',
    api(): Promise<TItem[]>;

    items?: TItem[];
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    sortSearchByRelevance?: boolean;
}
type ClientAsyncTreePropsWithOptionalMode<TItem, TId, TFilter = any> = Omit<ClientAsyncTreeProps<TItem, TId, TFilter>, 'mode'> & { mode?: 'client' };

export type TreeModeProps<TItem, TId, TFilter> = ClientAsyncTreePropsWithOptionalMode<TItem, TId, TFilter> | ServerAsyncTreeProps<TItem, TId, TFilter>;

export type ExtractTreeModeProps<T extends Modes, TItem, TId, TFilter = any> = Extract<TreeModeProps< TItem, TId, TFilter>, { mode: T }>;

export type TreeModeHook<T extends Modes> =
    <TItem, TId, TFilter = any>(
        props: ExtractTreeModeProps<T, TItem, TId, TFilter>,
        deps: any[],
    ) => UseTreeResult<TItem, TId, TFilter>;

export type AsyncTreeStrategyProps<TItem, TId, TFilter> =
{
    type: typeof STRATEGIES.async,
} &
TreeModeProps<TItem, TId, TFilter>;
