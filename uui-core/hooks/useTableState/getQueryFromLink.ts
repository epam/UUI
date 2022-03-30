import { Link } from "../../types";

export const getQueryFromLink = (link: Link) => {
    const searchParams =  new URLSearchParams(link.search);
    const query = {} as any;
    
    searchParams.forEach((value, key) => {
        query[key] = value;
    });
    return query;
};