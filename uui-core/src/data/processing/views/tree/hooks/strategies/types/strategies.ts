import { UseTreeResult } from '../../types';
import { STRATEGIES } from '../constants';
import { LazyTreeProps } from '../lazyTree/types';
import { SyncTreeProps } from '../syncTree/types';
import { AsyncTreeProps } from '../asyncTree/types';
import { ITree } from '../../../ITree';
import { RecordStatus } from '../../../types';

export type Strategies = typeof STRATEGIES[keyof typeof STRATEGIES];

export type ExtractTreeProps<T extends Strategies, TItem, TId, TFilter = any> = Extract<UseTreeProps< TItem, TId, TFilter>, { type: T }>;

export type TreeHook<T extends Strategies> =
    <TItem, TId, TFilter = any>(
        props: ExtractTreeProps<T, TItem, TId, TFilter>,
        deps: any[],
    ) => UseTreeResult<TItem, TId, TFilter>;

/**
 * useTree hook configuration.
 */
export type UseTreeProps<TItem, TId, TFilter = any> = (
    SyncTreeProps<TItem, TId, TFilter>
    | AsyncTreeProps<TItem, TId, TFilter>
    | LazyTreeProps<TItem, TId, TFilter>
);

/**
 * Load missing records getter.
 */
export interface LoadMissingRecords<TItem, TId> {
    /**
     * Loads missing records and provides a fulfilled tree.
     * @param id - id of an item, which is checked and records should be loaded for.
     * @param isChecked - checking status of the record.
     * @param isRoot - a flag, which marks if all records should be checked/unchecked.
     * @returns fulfilled tree with missing records, those required to be loaded for checking.
     */
    loadMissingRecordsOnCheck?: (id: TId, isChecked: boolean, isRoot: boolean) => Promise<ITree<TItem, TId>>;
}

/**
 * Item status getter.
 */
export interface GetItemStatus<TId> {
    /**
     * Provides a status of the given item.
     * @param id - id of an item, status to be provided for.
     * @returns status of the item.
     */
    getItemStatus?: (id: TId) => RecordStatus;
}
