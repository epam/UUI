import { DataQueryFilter, DataQueryFilterCondition } from '../../types/dataQuery';
import { dayJsHelper } from '../../helpers/dayJsHelper';

export function simplifyPredicates<T>(filter: DataQueryFilter<T>) {
    if (!filter) {
        return {};
    }
    const result: DataQueryFilter<T> = filter;
    const keys = Object.keys(filter) as (keyof T)[];
    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const condition = filter[key] as DataQueryFilterCondition<any>;
        if (condition != null && typeof condition === 'object') {
            if ('inRange' in condition) {
                const value = condition.inRange;
                result[key] = {
                    gte: value.from,
                    lte: value.to,
                };
            }
            if ('notInRange' in condition) {
                const value = condition.notInRange;
                result[key] = {
                    not: {
                        gte: value.from,
                        lte: value.to,
                    },
                };
            }

            if (Array.isArray(condition)) {
                result[key] = {
                    in: condition,
                };
            }
        }
    }
    return result;
}

function isDate(val: string): boolean {
    return dayJsHelper.dayjs(val).isValid();
}

const truePredicate = () => true;

export function getFilterPredicate<T>(filter: DataQueryFilter<T>): (e: T) => boolean {
    filter = simplifyPredicates(filter);

    if (filter == null) {
        return truePredicate;
    }

    const predicates: ((item: T) => boolean)[] = [];
    const keys = Object.keys(filter) as (keyof T)[];

    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const condition = filter[key] as DataQueryFilterCondition<any>;

        if (condition != null && typeof condition === 'object') {
            if ('isNull' in condition) {
                if (condition.isNull) {
                    predicates.push((item: T) => item[key] == null);
                } else {
                    predicates.push((item: T) => item[key] != null);
                }
            }

            if ('in' in condition && Array.isArray(condition.in)) {
                const values = condition.in as any[];
                predicates.push((item: T) => values.includes(item[key]));
            }

            if ('nin' in condition && Array.isArray(condition.nin)) {
                const values = condition.nin as any[];
                predicates.push((item: T) => !values.includes(item[key]));
            }

            if (condition.gte != null) {
                const conditionValue = condition.gte;
                predicates.push((item: T) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayJsHelper.dayjs(value).isSameOrAfter(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value >= conditionValue;
                });
            }

            if (condition.lte != null) {
                const conditionValue = condition.lte;
                predicates.push((item: T) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayJsHelper.dayjs(value).isSameOrBefore(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value <= conditionValue;
                });
            }

            if (condition.gt != null) {
                const conditionValue = condition.gt;
                predicates.push((item: T) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayJsHelper.dayjs(value).isAfter(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value > conditionValue;
                });
            }

            if (condition.lt != null) {
                const conditionValue = condition.lt;
                predicates.push((item: T) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayJsHelper.dayjs(value).isBefore(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value < conditionValue;
                });
            }

            if (condition.eq !== undefined && condition.eq !== null) {
                const conditionValue = condition.eq;
                predicates.push((item: T) => item[key] === conditionValue);
            }

            if (condition.neq !== undefined && condition.neq !== null) {
                const conditionValue = condition.neq;
                predicates.push((item: T) => item[key] !== conditionValue);
            }

            if ('not' in condition) {
                const predicate = getFilterPredicate({ [key]: condition.not });
                predicates.push((i) => !predicate(i));
            }
        } else {
            predicates.push((item: T) => {
                if (typeof condition === 'string' && isDate(condition)) {
                    return dayJsHelper.dayjs(item[key] as any).isSame(condition);
                } else {
                    return item[key] === condition;
                }
            });
        }
    }

    if (predicates.length === 1) {
        return predicates[0];
    } else if (predicates.length === 0) {
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
