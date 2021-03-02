"use strict";
exports.__esModule = true;
var eqPredicate = function (a, b) { return 0; };
// Previous versions use this comparer. While it works great for human-readable strings, it's broken for dates. Also, we need a plain sort in case of 'order' fields.
// const compareScalars = (new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})).compare;
function compareScalars(a, b, order) {
    if (a == null) {
        if (b == null) {
            return 0;
        }
        return -order;
    }
    if (b == null)
        return order;
    if (a < b)
        return -order;
    if (a === b)
        return 0;
    return order;
}
function getOrderComparer(sorting) {
    if (!sorting || sorting.length === 0) {
        return eqPredicate;
    }
    var sortingOrders = sorting.map(function (s) { return s.direction === 'desc' ? -1 : 1; });
    var comparer = function (a, b) {
        for (var n = 0; n < sorting.length; n++) {
            var fieldName = sorting[n].field;
            var compareResult = compareScalars(a[fieldName], b[fieldName], sortingOrders[n]);
            if (compareResult !== 0) {
                return compareResult;
            }
        }
        return 0;
    };
    return comparer;
}
exports.getOrderComparer = getOrderComparer;
