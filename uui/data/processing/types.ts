import { SortingOption, VirtualListState } from '../../types';
import {IDataSourceView} from "./views";
import {ListApiResponse} from "./ListApiCache";

export interface IDataSource<TItem, TId, TFilter> {
    getId(item: TItem): TId;
    getById(id: TId): TItem;
    setItem(item: TItem): void;
    getView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any): IDataSourceView<TItem, TId, TFilter>;
    useView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any): IDataSourceView<TItem, TId, TFilter>;
    unsubscribeView(onValueChange: (val: DataSourceState<any, TId>) => any): void;
}

export interface DataSourceState<TFilter = Record<string, any>, TId = any> extends VirtualListState {
    search?: string;
    checked?: TId[];
    folded?: Record<string, boolean>;
    filter?: TFilter;
    sorting?: SortingOption[];
    selectedId?: TId;
    focusedIndex?: number;
}

export interface LazyDataSourceApiRequestOptions<TItem, TFilter> {
    filter?: TFilter;
    sorting?: SortingOption[];
    search?: string;
}

export interface LazyDataSourceApiRequest<TItem, TId = any, TFilter = {}> extends LazyDataSourceApiRequestOptions<TItem, TFilter> {
    range?: { from: number, count: number };
    ids?: TId[];
}

export interface LazyDataSourceApiResponse<TItem> {
    items: TItem[];

    /**
     * API can set 'from' field if it wants to return more items than what was requested in request.range.
     * This can be used to return all items at once (with from:0, count: totalCount), or align response to pages.
     */
    from?: number;

    /** Total count of items which match current filter. If not specified, total count will be detected only when user scrolls to the end of the list. */
    count?: number;
}

export interface LazyDataSourceApiRequestContext<TItem, TId> {
    parentId: TId;
    parent: TItem;
}

export type LazyDataSourceApi<TItem, TId, TFilter> =
    (
        request: LazyDataSourceApiRequest<TItem, TId, TFilter>,
        details?: LazyDataSourceApiRequestContext<TItem, TId>,
    ) => Promise<LazyDataSourceApiResponse<TItem>>;

export interface IEntityStore<TEntity, TId> {
    get(id: TId): TEntity;
    set(id: TId, entity: TEntity): void;
}
export interface IArrayDataSource<TItem, TId, TFilter> extends IDataSource<TItem, TId, TFilter> {
    byKey: { [key: string]: TreeNode<TItem, TId> };
    byParentKey: { [key: string]: TreeNode<TItem, TId>[] };
    nodes: TreeNode<TItem, TId>[];
    rootNodes: TreeNode<TItem, TId>[];
    maxDepth: number;
}

export interface TreeNode<TItem, TId> {
    item: TItem;
    id: TId;
    key: string;
    parentId: TId;
    parentKey: string;
    path: string[];
    index: number;
    children: TreeNode<TItem, TId>[];
}

export interface ILazyDataSource<TItem, TFilter, TId> extends IDataSource<TItem, TId, TFilter> {
    getList(from: number, count: number, options: LazyDataSourceApiRequestOptions<TItem, TFilter>): ListApiResponse<TItem>;
}