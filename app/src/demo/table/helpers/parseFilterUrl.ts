import { svc } from "../../../services";

export const parseFilterUrl = (): object | undefined => {
    // const filter = svc.uuiRouter.getCurrentLink().query.filter;
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get("filter");
    if (!filter || filter === "undefined" || filter === "null") return undefined;
    
    return JSON.parse(decodeURIComponent(filter));
};
