import { getSearchFilter } from '../getSearchFilter';

describe('getSearchFilter', () => {
    it('should return matching results', () => {
        // const searchFilter = getSearchFilter('a b, a c, b c');
        const searchFilter = getSearchFilter('c,g');
        const result = searchFilter(['gc']);
        console.log('result', result);
        // expect(result).toEqual([]);
    });
});
