import { getSearchFilter } from '../getSearchFilter';

describe('getSearchFilter', () => {
    it('should return matching results', () => {
        // const searchFilter = getSearchFilter('a b, a c, b c');
        const searchFilter = getSearchFilter('a b e, b c e');
        const result = searchFilter(['gcb', 'ac', 'ba', 'ae']);
        console.log('result', result);
        // expect(result).toEqual([]);
    });
});
