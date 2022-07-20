import { LazyDataSourceApi, normalizeDataQueryFilter } from "@epam/uui";
import { Person } from "@epam/uui-docs";
import { svc } from "../../../services";

export const mapFilter = (filter: any) => {
    return Object.keys(filter).reduce((acc: any, key) => {
        return {
            ...acc,
            [key]: normalizeDataQueryFilter({
                in: Array.isArray(filter[key]) ? filter[key] : [filter[key]],
            }),
        };
    }, {});
};

export const api: LazyDataSourceApi<Person, number, Person> = (request, ctx) => {
    const mappedFilter = mapFilter(request.filter || {});
    return svc.api.demo.persons({ ...request, filter: mappedFilter } as any);
};