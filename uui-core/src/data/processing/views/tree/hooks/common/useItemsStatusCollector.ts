import { useMemo } from 'react';
import { DataSourceState, IMap, PatchOptions } from '../../../../../../types';
import { RecordStatus } from '../../types';
import { ItemsStatusCollector } from '../../ItemsStatusCollector';
import { ITreeParams, getSelectedAndChecked } from '../../treeStructure';

export interface UseItemsStatusCollectorProps<TItem, TId, TFilter = any> extends ITreeParams<TItem, TId>, Pick<PatchOptions<TItem, TId>, 'patch'> {
    itemsStatusMap?: IMap<TId, RecordStatus>;
    itemsStatusCollector?: ItemsStatusCollector<TItem, TId, TFilter>;
    dataSourceState: DataSourceState<TFilter, TId>;
}

export function useItemsStatusCollector<TItem, TId>(
    {
        itemsStatusMap,
        complexIds,
        getId,
        itemsStatusCollector,
        dataSourceState,
        patch,
    }: UseItemsStatusCollectorProps<TItem, TId>,
    deps: any[],
) {
    const statusCollector = useMemo(() => {
        if (itemsStatusCollector) {
            return itemsStatusCollector;
        }

        return new ItemsStatusCollector(itemsStatusMap, { complexIds, getId });
    }, deps);

    return useMemo(() => {
        return statusCollector.withPending(getSelectedAndChecked(dataSourceState, patch));
    }, [statusCollector]);
}
