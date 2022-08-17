export type SortDirection = 'asc' | 'desc';

export interface SortingOption<T = any> {
    field: keyof T;
    direction?: SortDirection;
}

export type DataQueryFilter<T> = {
    [TPropName in keyof T]?: DataQueryFilterCondition<T, T[TPropName]>
};

type RangeValue = { from: string, to: string };

export type DataQueryFilterCondition<TEntity, TField> = TField
     | { in?: TField[]; nin?: TField[]; isNull?: boolean; gt?: TField; gte?: TField;
    lt?: TField; lte?: TField; inRange?: RangeValue; notInRange?: RangeValue, eq?: TField, neq?: TField };

export type QueryPredicateName = 'eq'| 'neq' |'in' | 'nin' | 'isNull' | 'gt' | 'gte' | 'lt' | 'lte' | 'inRange' | 'notInRange';

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