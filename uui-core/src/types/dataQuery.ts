export type SortDirection = 'asc' | 'desc';

export interface SortingOption<T = any> {
    field: keyof T;
    direction?: SortDirection;
}

export type DataQueryFilter<T> = {
    [TPropName in keyof T]?: DataQueryFilterCondition<T[TPropName]>;
};

type RangeValue = { from: string; to: string };

export type DataQueryFilterCondition<TField> = TField | FilterPredicate<TField>;

export type FilterPredicate<TField> = {
    in?: TField[];
    nin?: TField[];
    isNull?: boolean;
    gt?: TField;
    gte?: TField;
    lt?: TField;
    lte?: TField;
    inRange?: RangeValue;
    notInRange?: RangeValue;
    eq?: TField;
    neq?: TField;
    not?: FilterPredicate<TField>;
};

export type FilterPredicateName = keyof FilterPredicate<any>;

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
