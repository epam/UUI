import * as models from '../models';
import {
    LazyDataSourceApiRequest, DataQueryFilter, LazyDataSourceApiResponse,
    IProcessRequest,
} from '@epam/uui-core';
import { personDetailsApi } from './personDetails';

export function getDemoApi(processRequest: IProcessRequest, origin: string = '') {
    function lazyApi<TEntity, TId>(name: string) {
        return (
            { signal, ...rq }: LazyDataSourceApiRequest<TEntity, TId, DataQueryFilter<TEntity>>,
        ) =>
            processRequest<LazyDataSourceApiResponse<TEntity>>(origin.concat('/api/').concat(name), 'POST', rq, { signal });
    }

    const isLazyDataSourceRequest = (request: unknown): request is LazyDataSourceApiRequest<any, any> | LazyDataSourceApiRequest<any, any> => {
        return request && typeof request === 'object' && 'signal' in request; 
    };
    
    function personGroups(
        request: LazyDataSourceApiRequest<models.PersonEmploymentGroup, number, DataQueryFilter<models.PersonEmploymentGroup>>, 
    ): Promise<LazyDataSourceApiResponse<models.PersonEmploymentGroup>>;
    function personGroups(
        request: LazyDataSourceApiRequest<models.PersonLocationGroup, string, DataQueryFilter<models.PersonLocationGroup>>,
    ): Promise<LazyDataSourceApiResponse<models.PersonLocationGroup>>;
    function personGroups(
        request: unknown,
    ) {
        return processRequest(
            origin.concat('/api/personGroups'),
            'POST',
            request,
            { signal: isLazyDataSourceRequest(request) ? request?.signal : undefined },
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
        personsPaged: (rq: LazyDataSourceApiRequest<models.Person, number, DataQueryFilter<models.Person>>) =>
            processRequest<LazyDataSourceApiResponse<models.Person>>(origin.concat('/api/persons-paged'), 'POST', rq, { signal: rq.signal }),
        personGroups,
        departments: lazyApi<models.Department, number>('departments'),
        jobTitles: lazyApi<models.JobTitle, number>('jobTitles'),
        schedules: () => processRequest<models.PersonSchedule[]>(origin.concat('/api/schedules'), 'POST'),
        personDetails: personDetailsApi,
        projectTasks: lazyApi<models.ProjectTask, number>('projectTasks'),
    };
}

export type IDemoApi = ReturnType<typeof getDemoApi>;
