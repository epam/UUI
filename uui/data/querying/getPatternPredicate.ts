import { DataQueryFilter, DataQueryFilterCondition, SortingOption } from "../../types/dataQuery";

const truePredicate = () => true;

export function normalizeDataQueryFilter<T>(filter: DataQueryFilter<T>) {
    if (!filter) {
        return {};
    }
    const result: DataQueryFilter<T> = {};
    const keys = Object.keys(filter) as (keyof T)[];
    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const condition = filter[key] as DataQueryFilterCondition<T, any>;
        if (condition) {
            if (typeof condition === "object" && 'in' in condition && (!Array.isArray(condition.in) || !condition.in.length)) {
                delete condition.in;
            }
            if (Object.keys(condition).length != 0) {
                result[key] = condition;
            }
        }
    }
    return result;
}

export function getPatternPredicate<T>(filter: DataQueryFilter<T>): (e: T) => boolean {
    if (filter == null) {
        return truePredicate;
    }

    const keys = Object.keys(filter) as (keyof T)[];

    const predicates: ((item: T) => boolean)[] = [];

    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const condition = filter[key] as DataQueryFilterCondition<T, any>;
        if (condition != null && typeof condition === "object") {
            if ('isNull' in condition) {
                if (condition.isNull) {
                    predicates.push((item: T) => item[key] == null);
                } else {
                    predicates.push((item: T) => item[key] != null);
                }
            }
            if ('in' in condition && Array.isArray(condition.in) && condition.in.length) {
                const values = condition.in as (any[]);
                predicates.push((item: T) => values.includes(item[key]));
            }
            if (condition.gte != null) {
                const conditionValue = condition.gte;
                predicates.push((item: T) => {
                    const value = item[key];
                    return !value || value >= conditionValue;
                });
            }
            if (condition.lte != null) {
                const conditionValue = condition.lte;
                predicates.push((item: T) => {
                    const value = item[key];
                    return !value || value <= conditionValue;
                });
            }
            if (condition.gt != null) {
                const conditionValue = condition.gt;
                predicates.push((item: T) => {
                    const value = item[key];
                    return !value || value > conditionValue;
                });
            }
            if (condition.lt != null) {
                const conditionValue = condition.lt;
                predicates.push((item: T) => {
                    const value = item[key];
                    return !value || value < conditionValue;
                });
            }
        } else {
            predicates.push((item: T) => item[key] === condition);
        }
    }

    if (predicates.length == 1) {
        return predicates[0];
    } else if (predicates.length == 0) {
        return truePredicate;
    } else {
        return (item: T) => {
            for (let n = 0; n < predicates.length; n++) {
                if (!predicates[n](item)) {
                    return false;
                }
            }
            return true;
        };
    }
}