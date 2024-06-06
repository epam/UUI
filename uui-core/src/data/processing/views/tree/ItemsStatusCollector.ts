import { IMap, LazyDataSourceApi } from '../../../../types';
import { ItemsMap } from './ItemsMap';
import { FAILED_RECORD, LOADED_RECORD, LOADING_RECORD, NOT_FOUND_RECORD, PENDING_RECORD } from './constants';
import { ITreeParams } from './exposed';
import { newMap } from './helpers';
import { RecordStatus } from './types';

interface OnStatusUpdateSubscribe<TId> {
    (itemsStatusMap: IMap<TId, RecordStatus>): void;
}

export class ItemsStatusCollector<TItem, TId, TFilter = any> {
    private itemsStatusMap: IMap<TId, RecordStatus>;
    private subscriptions: IMap<OnStatusUpdateSubscribe<TId>, undefined>;

    constructor(
        itemsStatusMap: IMap<TId, RecordStatus>,
        private params: ITreeParams<TItem, TId>,
    ) {
        this.itemsStatusMap = itemsStatusMap ?? newMap(params);
        this.subscriptions = newMap(params);
    }

    public setPending(ids: TId[]) {
        this.setStatus(ids, PENDING_RECORD);
    }

    public setLoading(ids: TId[]) {
        this.setStatus(ids, LOADING_RECORD);
    }

    public setLoaded(ids: TId[]) {
        this.setStatus(ids, LOADED_RECORD);
    }

    public setFailed(ids: TId[]) {
        this.setStatus(ids, FAILED_RECORD);
    }

    public setNotFound(ids: TId[]) {
        this.setStatus(ids, NOT_FOUND_RECORD);
    }

    public withPending(ids: TId[]) {
        ids.forEach((id) => {
            this.itemsStatusMap.set(id, PENDING_RECORD);
        });

        return this;
    }

    public getItemStatus = (itemsMap: ItemsMap<TId, TItem>) => (id: TId) => {
        if (itemsMap.has(id)) {
            return LOADED_RECORD;
        }

        const status = this.itemsStatusMap.get(id) ?? NOT_FOUND_RECORD;
        if (status === LOADED_RECORD) {
            return LOADING_RECORD;
        }

        return status;
    };

    public watch(api: LazyDataSourceApi<TItem, TId, TFilter>): LazyDataSourceApi<TItem, TId, TFilter> {
        return async (request, context) => {
            if (request.ids) {
                try {
                    this.setLoading(request.ids);
                    const result = await api(request, context);
                    const loadedIds: Array<[TId, TId]> = (result.items ?? []).map((item) => {
                        const id = this.params.getId(item);
                        return [id, id];
                    });

                    this.setLoaded(loadedIds.map(([id]) => id));

                    const loadedIdsMap = new Map<TId, TId>(loadedIds);
                    const notLoadedIds = request.ids.filter((id) => !loadedIdsMap.has(id));

                    this.setNotFound(notLoadedIds);

                    return result;
                } catch (e) {
                    this.setFailed(request.ids);
                    throw e;
                }
            }

            return await api(request, context);
        };
    }

    private setStatus(ids: TId[], status: RecordStatus) {
        ids.forEach((id) => {
            this.itemsStatusMap.set(id, status);
        });

        this.onUpdate();
    }

    private onUpdate() {
        for (const [onSubscribe] of this.subscriptions) {
            onSubscribe?.(this.itemsStatusMap);
        }
    }

    public subscribe(onSubscribe: OnStatusUpdateSubscribe<TId>): (() => void) {
        this.subscriptions = this.subscriptions.set(onSubscribe);
        return () => this.subscriptions.delete(onSubscribe);
    }
}
