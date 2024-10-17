exports.__esModule = true;
const { isDate } = require('./getFilterPredicate');

const eqPredicate = function () { return 0; };
// Previous versions use this comparer. While it works great for human-readable strings, it's broken for dates. Also, we need a plain sort in case of 'order' fields.
// const compareScalars = (new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})).compare;
function compareScalars(a, b, order) {
    if (a == null) {
        if (b == null) {
            return 0;
        }
        return -order;
    }
    if (b == null) return order;
    if (a < b) return -order;
    if (a === b) return 0;
    return order;
}
function getOrderComparer(sorting) {
    if (!sorting || sorting.length === 0 || !Array.isArray(sorting)) {
        return eqPredicate;
    }
    const sortingOrders = sorting.map(function (s) { return s.direction === 'desc' ? -1 : 1; });
    const comparer = function (a, b) {
        for (let n = 0; n < sorting.length; n++) {
            const fieldName = sorting[n].field;
            const isDateField = isDate(a[fieldName]) && isDate(b[fieldName]);
            const compareResult = isDateField
                ? compareScalars(new Date(a[fieldName]), new Date(b[fieldName]), sortingOrders[n])
                : compareScalars(a[fieldName], b[fieldName], sortingOrders[n]);
            if (compareResult !== 0) {
                return compareResult;
            }
        }
        return 0;
    };
    return comparer;
}
exports.getOrderComparer = getOrderComparer;
