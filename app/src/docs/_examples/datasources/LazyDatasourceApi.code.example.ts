export type LazyDataSourceApi<TItem, TId, TFilter> = (
    request: {
        filter?: TFilter;
        sorting?: Array<{
            field: string;
            direction?: 'asc' | 'desc';
        }>;
        search?: string;
        range?: {
            from: number;
            count?: number;
        };
        page?: number;
        pageSize?: number;
        ids?: TId[];
    },
    context?: {
        parentId?: TId | null;
        parent?: TItem | null;
    }
) => Promise<{
    items: TItem[];
    from?: number;
    count?: number;
}>;
