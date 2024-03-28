import { useMemo } from 'react';
import { IMap } from '../../../../../../types';
import { ITreeParams } from '../../';
import { RecordStatus } from '../../types';
import { ItemsStatusCollector } from '../../ItemsStatusCollector';

export interface UseItemsStatusCollectorProps<TItem, TId> extends ITreeParams<TItem, TId> {
    itemsStatusMap: IMap<TId, RecordStatus>;
}

export function useItemsStatusCollector<TItem, TId>(
    {
        itemsStatusMap,
        complexIds,
        getId,
    }: UseItemsStatusCollectorProps<TItem, TId>,
    deps: any[],
) {
    const itemsStatusCollector = useMemo(() => {
        return new ItemsStatusCollector(itemsStatusMap, { complexIds, getId });
    }, deps);

    return itemsStatusCollector;
}
