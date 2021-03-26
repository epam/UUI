import { LazyDataSourceApi, normalizeDataQueryFilter } from "@epam/uui";
import { svc } from "../../../services";
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from "../types";

const mapFilter = <TFilter extends PersonTableFilter>(filter: TFilter): { [TKey in keyof TFilter]: { in: TFilter[TKey] } } => {
    return Object.keys(filter).reduce((acc, key) => {
        acc[key] = normalizeDataQueryFilter({
            in: filter[key],
        });

        return acc;
    }, {} as any);
};

export const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = (request, ctx) => {
    let { ids: clientIds, filter: { groupBy, ...filter }, ...rq } = request;

    let ids = clientIds && clientIds.map(clientId => clientId[1]) as any[];

    if (groupBy && !ctx.parent) {
        return svc.api.demo.personGroups({
            ...rq,
            filter: { groupBy },
            search: null,
            itemsRequest: { filter, search: rq.search },
            ids,
        } as any);
    } else {
        const parentFilter = ctx.parent && { [groupBy + 'Id']: ctx.parent.id };
        const mappedFilter = mapFilter(filter);
        return svc.api.demo.persons({ ...rq, filter: { ...mappedFilter, ...parentFilter }, ids });
    }
};