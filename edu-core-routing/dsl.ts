import { Link } from './types';
import merge from 'lodash.merge';

export type LinkFactory<T, C> = (params?: T, query?: any) => Link & C;

export function buildLinkFactory<T>(schema: T): T {
    return buildRoutesRec('', { children: schema }, null, {});
}

export function route<P, C>(component: any, params?: P, props?: any, children?: C): Link & LinkFactory<P, C> & C {
    const result: any = { component, params, props, children };
    return result;
}

export function page<T>(component: any, params?: T, props?: any): Link & LinkFactory<T, void> {
    return route<T, void>(component, params, props, null);
}

export function node<C>(component: any, children: C): Link & C {
    return route<void, C>(component, null, null, children);
}

export function redirect(fn: () => string): void {
    const result: any = { redirect: fn };
    return result;
}

function buildRoutesRec(pathname: string, route: any, params: any, parentQuery: any): any {
    if (route.redirect) {
        return null;
    }

    const result: any = function (factoryParams: any, queryParam: any) {
        factoryParams = factoryParams || {};
        let parametrizedPath = pathname;

        if (route.params) {
            for (let paramName in route.params) {
                const value = factoryParams[paramName] || (params || {})[paramName] || '';
                parametrizedPath += '/' + value;
            }
        }

        const query = merge({}, parentQuery, queryParam);

        return buildRoutesRec(parametrizedPath, route, factoryParams, query);
    };

    result.pathname = pathname;
    result.query = parentQuery;

    if (route.children) {
        for (let name in route.children) {
            const childRoute = route.children[name];
            if (childRoute != null) {
                result[name] = buildRoutesRec(pathname + '/' + name, childRoute, params, parentQuery);
            }
        }
    }

    return result;
}