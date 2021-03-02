"use strict";
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
