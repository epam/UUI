import * as models from '../models';
import {
    LazyDataSourceApiRequest, DataQueryFilter, LazyDataSourceApiResponse, ApiCallOptions,
} from '@epam/uui-core';
import { personDetailsApi } from './personDetails';

export function getDemoApi(processRequest: (request: string, requestMethod: string, data?: any, options?: ApiCallOptions) => any, origin: string = '') {
    function lazyApi<TEntity, TId>(name: string) {
        return (rq: LazyDataSourceApiRequest<TEntity, TId, DataQueryFilter<TEntity>>) =>
            processRequest(origin.concat('/api/').concat(name), 'POST', rq) as Promise<LazyDataSourceApiResponse<TEntity>>;
    }

    function personGroups(
        request: LazyDataSourceApiRequest<models.PersonEmploymentGroup, number, DataQueryFilter<models.PersonEmploymentGroup>>
    ): Promise<LazyDataSourceApiResponse<models.PersonEmploymentGroup>>;
    function personGroups(
        request: LazyDataSourceApiRequest<models.PersonLocationGroup, string, DataQueryFilter<models.PersonLocationGroup>>,
    ): Promise<LazyDataSourceApiResponse<models.PersonLocationGroup>>;
    function personGroups(request: unknown) {
        return processRequest(origin.concat('/api/personGroups'), 'POST', request);
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
        personsPaged: (rq: LazyDataSourceApiRequest<models.Person, number, DataQueryFilter<models.Person>> & { page: number; pageSize: number }) =>
            processRequest(origin.concat('/api/persons-paged'), 'POST', rq) as Promise<LazyDataSourceApiResponse<models.Person>>,
        personGroups,
        departments: lazyApi<models.Department, number>('departments'),
        jobTitles: lazyApi<models.JobTitle, number>('jobTitles'),
        schedules: () => processRequest(origin.concat('/api/schedules'), 'POST') as Promise<models.PersonSchedule[]>,
        personDetails: personDetailsApi,
        todos: () => processRequest(origin.concat('/api/todos'), 'POST') as Promise<models.TodoTask[]>,
        projectTasks: lazyApi<models.ProjectTask, number>('projectTasks'),
    };
}

export type IDemoApi = ReturnType<typeof getDemoApi>;
