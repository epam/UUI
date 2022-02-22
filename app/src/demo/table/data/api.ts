import { LazyDataSourceApi, normalizeDataQueryFilter } from "@epam/uui";
import { svc } from "../../../services";
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from "../types";

const mapFilter = <TFilter extends PersonTableFilter>(filter: TFilter): { [TKey in keyof TFilter]: { in: TFilter[TKey] } } => {
    return Object.keys(filter).reduce((acc, key) => {
        return {
            ...acc,
            [key]: normalizeDataQueryFilter({
                in: Array.isArray(filter[key]) ? filter[key] : [filter[key]],
            }),
        };
    }, {} as { [TKey in keyof TFilter]: { in: TFilter[TKey] } });
};

export const api: LazyDataSourceApi<PersonTableRecord, string, PersonTableFilter> = (request, ctx) => {
    const { ids: clientIds, ...rq } = request;
    const groupBy = rq.filter?.groupBy;

     // Currently, DS shouldn't request items by id in Table scenarios. May need to revisit later.
    const complexIds = clientIds?.map(id => JSON.parse(id));

    if (groupBy && !ctx?.parent) {
        return svc.api.demo.personGroups({
            ...rq,
            filter: { groupBy },
            search: null,
            itemsRequest: { filter: rq.filter, search: rq.search },
        } as any);
    } else {
        const parentFilter = ctx?.parent?.id && groupBy ? { [groupBy + 'Id']: ctx.parent.id } : {};
        const { groupBy: omitGroupBy, ...mappedFilter } = mapFilter(rq.filter || {});
        return svc.api.demo.persons({ ...rq, filter: { ...mappedFilter, ...parentFilter } });
    }
};