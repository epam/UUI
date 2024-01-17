import { LazyDataSourceApiRequest } from './dataSources';

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

export interface DataQuery<T> extends Pick<LazyDataSourceApiRequest<T>, 'sorting' | 'range' | 'search'> {
    /** The filter object value with predicates, by which data should be filtered. */
    filter?: DataQueryFilter<T>;
}
