export const normalizeFilter = (filter: Record<string, any> | undefined) => {
    let result: Record<string, any> | undefined = undefined;

    if (filter && Object.keys(filter).length > 0) {
        result = { ...filter };
        
        Object.keys(result).forEach(key => {
            if (result[key] === undefined) delete result[key];
            // if (isEmptyRangeDatePicker(result[key])) delete result[key];
        });

        if (Object.keys(result).length === 0) result = undefined; 
    }
    
    return result;
};

// function isEmptyRangeDatePicker(filter: any): boolean  {
//     if (typeof filter !== "object") return false;
//     return filter.to === null && (filter.from === null || filter.from === undefined);
// }