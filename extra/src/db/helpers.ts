// TBD: New typescript would contain better typing for this. Remove this hack after update.
export function objectKeys<T>(obj: T): Extract<keyof T, string>[] {
    return Object.keys(obj) as Extract<keyof T, string>[];
}
