export const parseUrlFiltersConfig = (): Record<string, any> | undefined => {
    const searchParams = new URLSearchParams(location.search);
    const filtersConfig = searchParams.get("filtersConfig");
    if (!filtersConfig || filtersConfig === "undefined" || filtersConfig === "null") return undefined;
    
    return JSON.parse(decodeURIComponent(filtersConfig));
};