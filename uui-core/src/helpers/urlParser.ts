import * as jsurl from 'jsurl';
import * as queryString from 'query-string';

function stringify(query: any) {
    if (!query) {
        return null;
    }

    const result: any = {};
    cleanupObject(query);
    Object.keys(query).forEach((i) => (result[i] = typeof query[i] === ('object' || 'array') ? jsurl.stringify(query[i]) : query[i]));
    return queryString.stringify(result, { strict: false });
}

function parse(querystring: string) {
    if (!querystring) {
        return {};
    }

    const result = queryString.parse(querystring);
    Object.keys(result).forEach((i) => (result[i] = result[i][0] === '~' ? jsurl.parse(result[i]) : result[i]));
    return result;
}

function cleanupObject(obj: any): any {
    if (Array.isArray(obj)) {
        return obj
            .filter((item) => item !== null && item !== undefined)
            .map((item) => (typeof item === 'object' ? cleanupObject(item) : item));
    } else if (typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([, v]) => v !== null && v !== undefined)
                .map(([k, v]) => [k, typeof v === 'object' ? cleanupObject(v) : v]),
        );
    } else {
        return obj;
    }
}

export const urlParser = {
    stringify,
    parse,
};
