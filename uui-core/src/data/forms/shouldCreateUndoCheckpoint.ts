/**
 * Determines if useForm should create a new undo checkpoint.
 * c is the new change, a and b are previous checkpoints.
 * Returns false only if:
 * - a and b has exactly the same structure (types of fields recursively)
 * - scalar fields changed between b and c, are the same as between a and b.
 * In other words, it returns true only if user just edited the very same scalar field, as he did the last time
 */
export function shouldCreateUndoCheckpoint(a: any, b: any, c: any): boolean {
    // The field type is changed this time.
    // Probably is was null and became an object, or array become object.
    // Consider this a major change (adding row, creating some object for the first time)
    if (typeof b !== typeof c || Array.isArray(b) !== Array.isArray(c)) {
        return true;
    }

    // The field is an object of array - need to recurse thru it
    if (typeof c === 'object') {
        // Ignore that a, b, or c might be an empty array or object and has different structure.
        // If it's type changed, we already exited with 'true' on the first step
        // If some there's a difference between keys, values, array length
        // - we'll find this on the next level of recursion
        a = a || {};
        b = b || {};
        c = c || {};
        const keys: any[] = Object.keys({ ...a, ...b, ...c });
        return keys.some((key) => shouldCreateUndoCheckpoint(a[key], b[key], c[key]));
    }

    // The field is scalar (null, undefined, boolean, string, number, NaN)
    // In this case, we only need a checkpoint if it's changed for the first time.
    // E.g.
    // 'a' => 'ab' && 'ab' => 'abc' - false, we created checkpoint last time
    // 'a' => 'ab' && 'ab' => 'ab' - false, this field wasn't changed this time
    // 'a' => 'a' && 'a' => 'a'  - false, this field wasn't changed at all
    // 'a' => 'a' && 'a' => 'ab' - true, this field is changed for the first time
    return a === b && b !== c;
}
