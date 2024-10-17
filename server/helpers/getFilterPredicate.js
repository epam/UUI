"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getFilterPredicate = exports.simplifyPredicates = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore.js"));
var isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter.js"));
dayjs_1["default"].extend(isSameOrBefore_1["default"]);
dayjs_1["default"].extend(isSameOrAfter_1["default"]);
function simplifyPredicates(filter) {
    if (!filter) {
        return {};
    }
    var result = filter;
    var keys = Object.keys(filter);
    for (var n = 0; n < keys.length; n++) {
        var key = keys[n];
        var condition = filter[key];
        if (condition != null && typeof condition === "object") {
            if ('from' in condition && 'to' in condition) {
                result[key] = {
                    gte: condition.from,
                    lte: condition.to
                };
            }
            if ('inRange' in condition) {
                var value = condition.inRange;
                result[key] = {
                    gte: value.from,
                    lte: value.to
                };
            }
            if ('notInRange' in condition) {
                var value = condition.notInRange;
                result[key] = {
                    not: {
                        gte: value.from,
                        lte: value.to
                    }
                };
            }
            if (Array.isArray(condition) && condition.length) {
                result[key] = {
                    "in": condition
                };
            }
        }
    }
    return result;
}
exports.simplifyPredicates = simplifyPredicates;
function isDate(val) {
    return dayjs_1["default"](val).isValid();
}

exports.isDate = isDate;

var truePredicate = function () { return true; };
function getFilterPredicate(filter) {
    filter = simplifyPredicates(filter);
    if (filter == null) {
        return truePredicate;
    }
    var predicates = [];
    var keys = Object.keys(filter);
    var _loop_1 = function (n) {
        var _a;
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
            if ('in' in condition && Array.isArray(condition["in"])) {
                var values_1 = condition["in"];
                predicates.push(function (item) { return values_1.includes(item[key]); });
            }
            if ('nin' in condition && Array.isArray(condition.nin)) {
                var values_2 = condition.nin;
                predicates.push(function (item) { return !values_2.includes(item[key]); });
            }
            if (condition.gte != null) {
                var conditionValue_1 = condition.gte;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_1)) {
                        return dayjs_1["default"](value).isSameOrAfter(conditionValue_1);
                    }
                    return !(value !== null && value !== undefined) || value >= conditionValue_1;
                });
            }
            if (condition.lte != null) {
                var conditionValue_2 = condition.lte;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_2)) {
                        return dayjs_1["default"](value).isSameOrBefore(conditionValue_2);
                    }
                    return !(value !== null && value !== undefined) || value <= conditionValue_2;
                });
            }
            if (condition.gt != null) {
                var conditionValue_3 = condition.gt;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_3)) {
                        return (0, dayjs_1["default"])(value).isAfter(conditionValue_3);
                    }
                    return !(value !== null && value !== undefined) || value > conditionValue_3;
                });
            }
            if (condition.lt != null) {
                var conditionValue_4 = condition.lt;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_4)) {
                        return (0, dayjs_1["default"])(value).isBefore(conditionValue_4);
                    }
                    return !(value !== null && value !== undefined) || value < conditionValue_4;
                });
            }
            if (condition.eq !== undefined && condition.eq !== null) {
                var conditionValue_5 = condition.eq;
                predicates.push(function (item) { return item[key] === conditionValue_5; });
            }
            if (condition.neq !== undefined && condition.neq !== null) {
                var conditionValue_6 = condition.neq;
                predicates.push(function (item) { return item[key] !== conditionValue_6; });
            }
            if ('not' in condition) {
                var predicate_1 = getFilterPredicate((_a = {}, _a[key] = condition.not, _a));
                predicates.push(function (i) { return !predicate_1(i); });
            }
        }
        else {
            predicates.push(function (item) {
                if (typeof condition === "string" && isDate(condition)) {
                    return (0, dayjs_1["default"])(item[key]).isSame(condition);
                }
                else {
                    return item[key] === condition;
                }
            });
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
exports.getFilterPredicate = getFilterPredicate;
