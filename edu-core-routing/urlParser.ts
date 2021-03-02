import * as jsurl from 'jsurl';
import * as queryString from 'query-string';

const serializedTypes: Record<string, boolean> = {
    'boolean': true,
    'object': true,
    'array': true,
    'number': true,
};

function stringifyQuery(query: any) {
    if (!query) {
        return null;
    }

    let result: any = {};
    cleaningObject(query);
    Object.keys(query).map(i => result[i] = serializedTypes[typeof query[i]] ? jsurl.stringify(query[i]) : query[i]);
    return queryString.stringify(result, { strict: false });
}

function parseQueryString(querystring: string) {
    if (!querystring) {
        return {};
    }

    const result = queryString.parse(querystring);
    Object.keys(result).map(i => result[i] = result[i][0] === '~' ? jsurl.parse(result[i]) : result[i]);
    return result;
}

function cleaningObject(obj: any) {
    const isArray = obj instanceof Array;
    for (const k in obj) {
        if (obj[k] === null || obj[k] === undefined) isArray ? obj.splice(k, 1) : delete obj[k];
        else if (typeof obj[k] == "object") cleaningObject(obj[k]);
    }
}

export const urlParser = {
    stringifyQuery,
    parseQueryString,
    cleaningObject,
};