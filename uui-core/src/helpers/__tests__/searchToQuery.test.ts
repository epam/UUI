import { queryToSearch } from '../queryToSearch';
import { searchToQuery } from '../searchToQuery';

describe('searchToQuery', () => {
    it('should parse plain string parameters', () => {
        expect(searchToQuery('foo=bar&baz=qux')).toEqual({ foo: 'bar', baz: 'qux' });
    });

    it('should parse JSON object parameters', () => {
        const search = 'filter=' + encodeURIComponent(JSON.stringify({ name: 'test' }));
        expect(searchToQuery(search)).toEqual({ filter: { name: 'test' } });
    });

    it('should fall back to raw string when value is not valid JSON', () => {
        expect(searchToQuery('q=hello')).toEqual({ q: 'hello' });
        expect(searchToQuery('q=not{json')).toEqual({ q: 'not{json' });
    });

    it('should skip parameters with empty value', () => {
        expect(searchToQuery('a=1&b=&c=2')).toEqual({ a: 1, c: 2 });
    });

    it('should parse filter parameter with percent in value (e.g. filter={ someKey: "value%" })', () => {
        const query = { filter: { someKey: 'value%' } };
        const search = queryToSearch(query);
        expect(searchToQuery(search)).toEqual(query);
    });

    it('should work with leading question mark', () => {
        expect(searchToQuery('?a=1&b=2')).toEqual({ a: 1, b: 2 });
    });
});
