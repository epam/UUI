"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getPatternPredicate = exports.convertPredicates = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore"));
var isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
dayjs_1["default"].extend(isSameOrBefore_1["default"]);
dayjs_1["default"].extend(isSameOrAfter_1["default"]);
function convertPredicates(filter) {
    if (!filter) {
        return {};
    }
    var result = filter;
    var keys = Object.keys(filter);
    for (var n = 0; n < keys.length; n++) {
        var key = keys[n];
        var condition = filter[key];
        if (condition != null && typeof condition === "object") {
            if ('inRange' in condition) {
                var value = condition.inRange;
                result[key] = {
                    gt: value.from,
                    lt: value.to
                };
            }
            if ('notInRange' in condition) {
                result[key] = {
                    lt: condition.from,
                    gt: condition.to
                };
            }
            if (Array.isArray(condition)) {
                result[key] = {
                    "in": condition
                };
            }
        }
    }
    return result;
}
exports.convertPredicates = convertPredicates;
function isDate(val) {
    return (0, dayjs_1["default"])(val).isValid();
}
var truePredicate = function () { return true; };
function getPatternPredicate(filter) {
    filter = convertPredicates(filter);
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
                predicates.push(function (item) { return values_1.includes(item[key]); });
            }
            if ('nin' in condition && Array.isArray(condition.nin) && condition.nin.length) {
                var values_2 = condition.nin;
                predicates.push(function (item) { return !values_2.includes(item[key]); });
            }
            if (condition.gte != null) {
                var conditionValue_1 = condition.gte;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_1)) {
                        return (0, dayjs_1["default"])(value).isSameOrAfter(conditionValue_1);
                    }
                    return value >= conditionValue_1;
                });
            }
            if (condition.lte != null) {
                var conditionValue_2 = condition.lte;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_2)) {
                        return (0, dayjs_1["default"])(value).isSameOrBefore(conditionValue_2);
                    }
                    return value <= conditionValue_2;
                });
            }
            if (condition.gt != null) {
                var conditionValue_3 = condition.gt;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_3)) {
                        return (0, dayjs_1["default"])(value).isAfter(conditionValue_3);
                    }
                    return value > conditionValue_3;
                });
            }
            if (condition.lt != null) {
                var conditionValue_4 = condition.lt;
                predicates.push(function (item) {
                    var value = item[key];
                    if (typeof value === "string" && isDate(conditionValue_4)) {
                        return (0, dayjs_1["default"])(value).isBefore(conditionValue_4);
                    }
                    return value < conditionValue_4;
                });
            }
            if (condition.eq) {
                var conditionValue_5 = condition.eq;
                predicates.push(function (item) { return item[key] === conditionValue_5; });
            }
            if (condition.neq) {
                var conditionValue_6 = condition.neq;
                predicates.push(function (item) { return item[key] !== conditionValue_6; });
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
