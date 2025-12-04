import { DataQuery, LazyDataSourceApiResponse } from '@epam/uui-core';
import { ILoadingTracker } from './types';

interface ListRecord<TItem> {
    options: DataQuery<TItem>;
    count: number;
    maxCount: number;
    isComplete: boolean;
}

export interface ListLoadingTrackerOptions<TItem, TResponse> {
    extractList?: (response: TResponse) => LazyDataSourceApiResponse<TItem>;
}

export class ListLoadingTracker<TItem, TRequest extends DataQuery<TItem> = DataQuery<TItem>, TResponse = LazyDataSourceApiResponse<TItem>>
implements ILoadingTracker<TRequest, TResponse> {
    private cache: Map<string, ListRecord<TItem>> = new Map();
    private extractList: (res: TResponse) => LazyDataSourceApiResponse<TItem>;
    constructor(private options?: ListLoadingTrackerOptions<TItem, TResponse>) {
        this.extractList = options?.extractList || ((r: any) => r);
    }

    private prepare(request: DataQuery<TItem>) {
        const {
            filter, sorting, search, range, ...unknownFields
        } = request;
        const options: DataQuery<TItem> = { signal: null };

        if (filter) {
            options.filter = filter;
        }

        if (sorting) {
            options.sorting = sorting;
        }

        if (search) {
            options.search = search;
        }

        const keyObject = { ...options, ...unknownFields };

        const key = JSON.stringify(keyObject);
        let entry = this.cache.get(key);
        if (!entry) {
            entry = {
                options, count: 0, maxCount: null, isComplete: false,
            };
            this.cache.set(key, entry);
        }

        return {
            options, range, unknownFields, entry,
        };
    }

    public diff(request: TRequest): TRequest {
        const {
            options, range, unknownFields, entry,
        } = this.prepare(request);

        if (entry.isComplete) {
            return null;
        }

        if (!request.range) {
            return request;
        } else {
            const requestedMax = request.range.from + request.range.count;
            let missingCount = requestedMax - entry.count;

            if (entry.maxCount) {
                missingCount = Math.min(missingCount, entry.maxCount);
            }

            if (missingCount > 0) {
                return {
                    ...options,
                    ...unknownFields,
                    range: { from: entry.count, count: requestedMax - entry.count },
                } as TRequest;
            } else {
                return null;
            }
        }
    }

    public count(request: TRequest) {
        const { entry } = this.prepare(request);

        return { knownCount: Math.max(entry.count, entry.maxCount), exactCount: entry.maxCount };
    }

    public append(request: TRequest, response?: TResponse) {
        const {
            options, range, unknownFields, entry,
        } = this.prepare(request);

        if (response) {
            const list = this.extractList(response);

            if (list.count) {
                entry.maxCount = list.count;
            }

            if (!range) {
                entry.count = list.items.length;
                entry.maxCount = list.items.length;
                entry.isComplete = true;
            } else {
                const from = list.from == null ? range.from : list.from;

                if (list.items.length > 0) {
                    entry.count = Math.max(entry.count, from + list.items.length);
                }

                if (list.items.length < range.count) {
                    entry.maxCount = from + list.items.length;
                    entry.count = entry.maxCount;
                    entry.isComplete = true;
                }
            }
        } else {
            if (range) {
                entry.count = Math.max(entry.count, request.range.from + request.range.count);
            } else {
                entry.isComplete = true;
            }
        }
    }
}
