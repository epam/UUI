import { LazyDataSourceApiRequest } from './dataSources';

export type DataQueryFilter<T> = {
    [TPropName in keyof T]?: DataQueryFilterCondition<T[TPropName]>;
};

type RangeValue = { from: string; to: string };

export type DataQueryFilterCondition<TField> = TField | FilterPredicate<TField>;

export type FilterPredicate<TField> = {
    /** In. Should match some of these values. */
    in?: TField[];
    /** Not In. Should not match some of these values. */
    nin?: TField[];
    /** Should be null */
    isNull?: boolean;
    /** Greater than */
    gt?: TField;
    /** Greater than or equal */
    gte?: TField;
    /** Lower than */
    lt?: TField;
    /** Lower than or equal */
    lte?: TField;
    /** In range. Should be in these range */
    inRange?: RangeValue;
    /** Not in range. Should not be in these range */
    notInRange?: RangeValue;
    /** Equal */
    eq?: TField;
    /** Not equal */
    neq?: TField;
    /** Should not much provide predicates */
    not?: FilterPredicate<TField>;
};

export type FilterPredicateName = keyof FilterPredicate<any>;

export interface DataQuery<T> extends Pick<LazyDataSourceApiRequest<T>, 'sorting' | 'range' | 'search'> {
    /** The filter object value with predicates, by which data should be filtered. */
    filter?: DataQueryFilter<T>;
}
