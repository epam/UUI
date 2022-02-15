export type SortDirection = 'asc' | 'desc';

export interface SortingOption<TItem> {
    field: keyof TItem;
    direction?: SortDirection;
}

export type DataQueryFilter<T> = {
    [TPropName in keyof T]?: DataQueryFilterCondition<T, T[TPropName]>
};

export type DataQueryFilterCondition<TEntity, TField> = TField
     | { in?: TField[]; isNull?: boolean; gt?: TField; gte?: TField; lt?: TField; lte?: TField };
     //| { $or: DbQueryPatternCondition<TEntity, TField>[] };

export interface DataQueryRange {
    from: number;
    count?: number;
}

export interface DataQuery<T> {
    filter?: DataQueryFilter<T>;
    sorting?: SortingOption<T>[];
    range?: DataQueryRange;
    search?: string;
}