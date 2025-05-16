import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function simplifyPredicates(filter) {
    if (!filter) {
        return {};
    }
    let result = filter;
    const keys = Object.keys(filter);
    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const condition = filter[key];
        if (condition != null && typeof condition === 'object') {
            if ('from' in condition && 'to' in condition) {
                result[key] = {
                    gte: condition.from,
                    lte: condition.to,
                };
            }
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
            if (Array.isArray(condition) && condition.length) {
                result[key] = {
                    in: condition,
                };
            }
        }
    }
    return result;
}

export function isDate(val) {
    return dayjs(val).isValid();
}

const truePredicate = () => true;

export function getFilterPredicate(filter) {
    filter = simplifyPredicates(filter);
    if (filter == null) {
        return truePredicate;
    }
    const predicates = [];
    const keys = Object.keys(filter);
    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const condition = filter[key];
        if (condition != null && typeof condition === 'object') {
            if ('isNull' in condition) {
                if (condition.isNull) {
                    predicates.push((item) => item[key] == null);
                } else {
                    predicates.push((item) => item[key] != null);
                }
            }
            if ('in' in condition && Array.isArray(condition['in'])) {
                const values = condition['in'];
                predicates.push((item) => values.includes(item[key]));
            }
            if ('nin' in condition && Array.isArray(condition.nin)) {
                const values = condition.nin;
                predicates.push((item) => !values.includes(item[key]));
            }
            if (condition.gte != null) {
                const conditionValue = condition.gte;
                predicates.push((item) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayjs(value).isSameOrAfter(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value >= conditionValue;
                });
            }
            if (condition.lte != null) {
                const conditionValue = condition.lte;
                predicates.push((item) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayjs(value).isSameOrBefore(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value <= conditionValue;
                });
            }
            if (condition.gt != null) {
                const conditionValue = condition.gt;
                predicates.push((item) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayjs(value).isAfter(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value > conditionValue;
                });
            }
            if (condition.lt != null) {
                const conditionValue = condition.lt;
                predicates.push((item) => {
                    const value = item[key];
                    if (typeof value === 'string' && isDate(conditionValue)) {
                        return dayjs(value).isBefore(conditionValue);
                    }
                    return !(value !== null && value !== undefined) || value < conditionValue;
                });
            }
            if (condition.eq !== undefined && condition.eq !== null) {
                const conditionValue = condition.eq;
                predicates.push((item) => item[key] === conditionValue);
            }
            if (condition.neq !== undefined && condition.neq !== null) {
                const conditionValue = condition.neq;
                predicates.push((item) => item[key] !== conditionValue);
            }
            if ('not' in condition) {
                const predicate = getFilterPredicate({ [key]: condition.not });
                predicates.push((i) => !predicate(i));
            }
        } else {
            predicates.push((item) => {
                if (typeof condition === 'string' && isDate(condition)) {
                    return dayjs(item[key]).isSame(condition);
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
        return (item) => {
            for (let n = 0; n < predicates.length; n++) {
                if (!predicates[n](item)) {
                    return false;
                }
            }
            return true;
        };
    }
}
