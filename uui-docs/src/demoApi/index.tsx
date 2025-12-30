import * as models from '../models';
import {
    LazyDataSourceApiRequest, DataQueryFilter, LazyDataSourceApiResponse,
    IProcessRequest,
    LazyDataSourceApiRequestContext,
} from '@epam/uui-core';
import { personDetailsApi } from './personDetails';

export function getDemoApi(processRequest: IProcessRequest, origin: string = '') {
    function lazyApi<TEntity, TId>(name: string) {
        return (
            rq: LazyDataSourceApiRequest<TEntity, TId, DataQueryFilter<TEntity>>,
            context?: LazyDataSourceApiRequestContext<TEntity, TId>,
        ) => {
            return processRequest<LazyDataSourceApiResponse<TEntity>>(origin.concat('/api/').concat(name), 'POST', rq, { fetchOptions: { signal: context?.signal } });
        };
    }

    function personGroups(
        request: LazyDataSourceApiRequest<models.PersonEmploymentGroup, number, DataQueryFilter<models.PersonEmploymentGroup>>,
        ctx?: LazyDataSourceApiRequestContext<models.PersonEmploymentGroup, number>,
    ): Promise<LazyDataSourceApiResponse<models.PersonEmploymentGroup>>;
    function personGroups(
        request: LazyDataSourceApiRequest<models.PersonLocationGroup, string, DataQueryFilter<models.PersonLocationGroup>>,
        ctx?: LazyDataSourceApiRequestContext<models.PersonLocationGroup, string>,
    ): Promise<LazyDataSourceApiResponse<models.PersonLocationGroup>>;
    function personGroups(
        request: unknown,
        ctx?: LazyDataSourceApiRequestContext<unknown, unknown>,
    ) {
        return processRequest(
            origin.concat('/api/personGroups'),
            'POST',
            request,
            { fetchOptions: { signal: ctx?.signal } },
        );
    }

    return {
        cities: lazyApi<models.City, string>('cities'),
        offices: lazyApi<models.Office, string>('offices'),
        continents: lazyApi<models.Continent, string>('continents'),
        countries: lazyApi<models.Country, string>('countries'),
        languages: lazyApi<models.Language, string>('languages'),
        products: lazyApi<models.Product, number>('products'),
        locations: lazyApi<models.Location, string>('locations'),
        locationsSearch: lazyApi<models.Location, string>('locations/search-tree'),
        statuses: lazyApi<models.Status, string>('statuses'),
        managers: lazyApi<models.Manager, string>('managers'),
        persons: lazyApi<models.Person, number>('persons'),
        personsPaged: (
            rq: LazyDataSourceApiRequest<models.Person, number, DataQueryFilter<models.Person>>,
            ctx?: LazyDataSourceApiRequestContext<models.Person, number>,
        ) =>
            processRequest<LazyDataSourceApiResponse<models.Person>>(origin.concat('/api/persons-paged'), 'POST', rq, { fetchOptions: { signal: ctx?.signal } }),
        personGroups,
        departments: lazyApi<models.Department, number>('departments'),
        jobTitles: lazyApi<models.JobTitle, number>('jobTitles'),
        schedules: () => processRequest<models.PersonSchedule[]>(origin.concat('/api/schedules'), 'POST'),
        personDetails: personDetailsApi,
        projectTasks: lazyApi<models.ProjectTask, number>('projectTasks'),
    };
}

export type IDemoApi = ReturnType<typeof getDemoApi>;
