import shallowEqual from 'shallowequal';
import zip from 'lodash.zip';
import transform from 'lodash.transform';
import isEqual from 'fast-deep-equal';

// TBD: New typescript would contain better typing for this. Remove this hack after update.
export const objectKeys: <T>(obj: T) => (keyof T)[] = Object.keys as any;

export function defaultCompareViewDependencies<T>(prev: T, next: T): boolean {
    if (Array.isArray(prev) && Array.isArray(next)) {
        if (prev.length === next.length) {
            return zip(prev, next).every(([p, n]) => shallowEqual(p, n));
        }
        return false;
    }
    return shallowEqual(prev, next);
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference(obj: any, baseObj: any) {
    function changes(object: any, base: any) {
        return transform(object, function (result: any, value: any, key: any) {
            if (!isEqual(value, base[key])) {
                result[key] = (typeof value === 'object' && typeof base[key] === 'object') ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(obj, baseObj);
}
