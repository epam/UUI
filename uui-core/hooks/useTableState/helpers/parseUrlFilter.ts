export const parseUrlFilter = (): Record<string, any> | undefined => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get("filter");
    if (!filter || filter === "undefined" || filter === "null") return undefined;

    return JSON.parse(decodeURIComponent(filter));
};