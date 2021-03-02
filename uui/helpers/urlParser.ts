import * as jsurl from 'jsurl';
import * as queryString from 'query-string';

function stringify(query: any) {
    if (!query) {
        return null;
    }

    const result: any = {};
    cleanupObject(query);
    Object.keys(query).map(i => result[i] = typeof query[i] === ('object' || 'array') ? jsurl.stringify(query[i]) : query[i]);
    return queryString.stringify(result, { strict: false });
}

function parse(querystring: string) {
    if (!querystring) {
        return {};
    }

    const result = queryString.parse(querystring);
    Object.keys(result).map(i => result[i] = result[i][0] === '~' ? jsurl.parse(result[i]) : result[i]);
    return result;
}

function cleanupObject(obj: any) {
    const isArray = obj instanceof Array;
    for (const k in obj) {
        if (obj[k] === null || obj[k] === undefined) isArray ? obj.splice(k, 1) : delete obj[k];
        else if (typeof obj[k] === "object") cleanupObject(obj[k]);
    }
}

export const urlParser = {
    stringify,
    parse,
};