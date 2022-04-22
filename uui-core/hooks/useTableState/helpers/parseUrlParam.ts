export const parseUrlParam = (paramName: "filter" | "filtersConfig"): Record<string, any> | undefined => {
    const searchParams = new URLSearchParams(location.search);
    const param = searchParams.get(paramName);
    if (!param || param === "undefined" || param === "null") return undefined;
    
    return JSON.parse(decodeURIComponent(param));
};