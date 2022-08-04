"use strict";
const _ = require("lodash");
const dayjs = require("dayjs");
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');

exports.__esModule = true;
var truePredicate = function () { return true; };
function getPatternPredicate(filter) {
    if (filter == null) {
        return truePredicate;
    }
    var keys = Object.keys(filter);
    var predicates = [];
    var _loop_1 = function (n) {
        var key = keys[n];
        var condition = filter[key];
        if (condition != null && typeof condition === "object") {
            if ('isNull' in condition) {
                if (condition.isNull) {
                    predicates.push(function (item) { return item[key] == null; });
                }
                else {
                    predicates.push(function (item) { return item[key] != null; });
                }
            }
            if ('in' in condition && Array.isArray(condition["in"]) && condition["in"].length) {
                var values_1 = condition["in"];

                if (key === 'hireDate' && filter[key] !== undefined) {
                    if (filter[key]?.in[0] === null) {
                        return truePredicate
                    }
                    predicates.push(function (item) { return dayjs(values_1[0]).isSame(dayjs(item[key]), 'date'); });
                    return;
                }
                if (key === 'birthDate' && _.isPlainObject(values_1[0])) {
                    const dateFrom = values_1[0]?.from ;
                    const dateTo = values_1[0]?.to;

                    if (dateFrom === null && dateTo === null) {
                        return truePredicate
                    } else if (dateFrom === null && dateTo !== null) {
                        dayjs.extend(isSameOrBefore);
                        predicates.push(function (item) { return dayjs(dayjs(item[key]).format('YYYY-MM-DD')).isSameOrBefore(dateTo, 'date'); });
                        return;
                    } else if (dateFrom !== null && dateTo === null) {
                        dayjs.extend(isSameOrAfter);
                        predicates.push(function (item) { return dayjs(dayjs(item[key]).format('YYYY-MM-DD')).isSameOrAfter(dateFrom, 'date'); });
                        return;
                    } else if (dateFrom !== null && dateTo !== null) {
                        dayjs.extend(isBetween)
                        predicates.push(function (item) { return dayjs(dayjs(item[key]).format('YYYY-MM-DD')).isBetween(dateFrom, dateTo, null, '[]'); });
                        return;
                    }
                }
                predicates.push(function (item) { return values_1.includes(item[key]); });
            }
            if (condition.gte != null) {
                var conditionValue_1 = condition.gte;
                predicates.push(function (item) {
                    var value = item[key];
                    return !value || value >= conditionValue_1;
                });
            }
            if (condition.lte != null) {
                var conditionValue_2 = condition.lte;
                predicates.push(function (item) {
                    var value = item[key];
                    return !value || value <= conditionValue_2;
                });
            }
            if (condition.gt != null) {
                var conditionValue_3 = condition.gt;
                predicates.push(function (item) {
                    var value = item[key];
                    return !value || value > conditionValue_3;
                });
            }
            if (condition.lt != null) {
                var conditionValue_4 = condition.lt;
                predicates.push(function (item) {
                    var value = item[key];
                    return !value || value < conditionValue_4;
                });
            }
        }
        else {
            predicates.push(function (item) { return item[key] === condition; });
        }
    };
    for (var n = 0; n < keys.length; n++) {
        _loop_1(n);
    }
    if (predicates.length == 1) {
        return predicates[0];
    }
    else if (predicates.length == 0) {
        return truePredicate;
    }
    else {
        return function (item) {
            for (var n = 0; n < predicates.length; n++) {
                if (!predicates[n](item)) {
                    return false;
                }
            }
            return true;
        };
    }
}
exports.getPatternPredicate = getPatternPredicate;
