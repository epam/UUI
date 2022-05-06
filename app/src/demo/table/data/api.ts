import { LazyDataSourceApi, normalizeDataQueryFilter } from "@epam/uui";
import { Person } from "uui-docs";
import { svc } from "../../../services";
import { PersonTableFilter } from "../types";

export const mapFilter = <TFilter extends PersonTableFilter>(filter: TFilter): { [TKey in keyof TFilter]: { in: TFilter[TKey] } } => {
    return Object.keys(filter).reduce((acc, key) => {
        return {
            ...acc,
            [key]: normalizeDataQueryFilter({
                in: Array.isArray(filter[key]) ? filter[key] : [filter[key]],
            }),
        };
    }, {} as { [TKey in keyof TFilter]: { in: TFilter[TKey] } });
};

export const api: LazyDataSourceApi<Person, number, PersonTableFilter> = (request, ctx) => {
    const { ids: clientIds, ...rq } = request;
    const groupBy = rq.filter?.groupBy;

    const parentFilter = ctx?.parent?.id && groupBy ? { [groupBy + 'Id']: ctx.parent.id } : {};
    const { groupBy: omitGroupBy, ...mappedFilter } = mapFilter(rq.filter || {});
    return svc.api.demo.persons({ ...rq, filter: { ...mappedFilter, ...parentFilter } });
};