import { getSearchFilter } from '../getSearchFilter';

describe('getSearchFilter', () => {
    it('should return matching results', () => {
        // const searchFilter = getSearchFilter('a b, a c, b c');
        const searchFilter = getSearchFilter('a b e');
        const result = searchFilter(['cd', 'de', 'cb', 'ac', 'ba', 'ab']);
        // console.log('result', result);
        // expect(result).toEqual([]);
    });
});
