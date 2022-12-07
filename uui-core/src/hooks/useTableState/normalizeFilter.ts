import isEmpty from "lodash.isempty";

export const normalizeFilter = (filter: Record<string, any> | undefined) => {
    if (filter === undefined) return filter;
    
    const result = Object.keys(filter).reduce((acc, key) => {
        if (filter[key] !== undefined) acc[key] = filter[key];
        return acc;
    }, {} as typeof filter);
    
    return isEmpty(result) ? undefined : result;
};