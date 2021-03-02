import * as models from '../models';
import { LazyDataSourceApiRequest, DataQueryFilter, LazyDataSourceApiResponse } from '@epam/uui';
import { personDetailsApi } from './personDetails';

export function getDemoApi(processRequest: (request: string, requestMethod: string, data?: any, options?: RequestInit) => any) {
    function lazyApi<TEntity, TId>(name: string) {
        return (rq: LazyDataSourceApiRequest<TEntity, TId, DataQueryFilter<TEntity>>) => processRequest('/api/' + name, 'POST', rq) as Promise<LazyDataSourceApiResponse<TEntity>>;
    }

    return {
        cities: lazyApi<models.City, string>('cities'),
        offices: lazyApi<models.Office, string>('offices'),
        continents: lazyApi<models.Continent, string>('continents'),
        countries: lazyApi<models.Country, string>('countries'),
        languages: lazyApi<models.Language, string>('languages'),
        products: lazyApi<models.Product, number>('products'),
        locations: lazyApi<models.Location, string>('locations'),
        statuses: lazyApi<models.Status, string>('statuses'),
        managers: lazyApi<models.Manager, string>('managers'),
        persons: lazyApi<models.Person, number>('persons'),
        personGroups: (rq: LazyDataSourceApiRequest<models.PersonGroup, number, DataQueryFilter<models.PersonGroup>>) =>
            processRequest('/api/personGroups', 'POST', rq) as Promise<LazyDataSourceApiResponse<models.PersonGroup>>,
        departments: lazyApi<models.Department, number>('departments'),
        jobTitles: lazyApi<models.JobTitle, number>('jobTitles'),
        schedules: () => processRequest('/api/schedules', 'POST') as Promise<models.PersonSchedule[]>,
        personDetails: personDetailsApi,
    };
}

const tApi = getDemoApi(null);
export type IDemoApi = typeof tApi;