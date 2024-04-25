import { useMemo } from 'react';
import { IMap } from '../../../../../../types';
import { RecordStatus } from '../../types';
import { ItemsStatusCollector } from '../../ItemsStatusCollector';
import { ITreeParams } from '../../treeStructure';

export interface UseItemsStatusCollectorProps<TItem, TId, TFilter = any> extends ITreeParams<TItem, TId> {
    itemsStatusMap?: IMap<TId, RecordStatus>;
    itemsStatusCollector?: ItemsStatusCollector<TItem, TId, TFilter>;
}

export function useItemsStatusCollector<TItem, TId>(
    {
        itemsStatusMap,
        complexIds,
        getId,
        itemsStatusCollector,
    }: UseItemsStatusCollectorProps<TItem, TId>,
    deps: any[],
) {
    return useMemo(() => {
        if (itemsStatusCollector) {
            return itemsStatusCollector;
        }

        return new ItemsStatusCollector(itemsStatusMap, { complexIds, getId });
    }, deps);
}
