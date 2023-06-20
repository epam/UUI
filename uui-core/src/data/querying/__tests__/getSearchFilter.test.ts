import { getSearchFilter } from '../getSearchFilter';

describe('getSearchFilter', () => {
    it('should return matching results', () => {
        const searchFilter = getSearchFilter('first second, third forth');
        const result = searchFilter(['first word', 'third word', 'second, forth']);
        expect(result).toEqual([
            // first
            0,
            null,
            null,

            // second
            null,
            null,
            0,

            // third
            null,
            0,
            null,

            // forth
            null,
            null,
            8,
        ]);
    });
    it('should fill not found group with null', () => {
        const searchFilter = getSearchFilter('first second, forn');
        const result = searchFilter(['first word', 'third word', 'second, forth']);
        expect(result).toEqual([
            // first
            0,
            null,
            null,

            // second
            null,
            null,
            0,

            // forn
            null,
            null,
            null,
        ]);
    });

    it('should return false if some group', () => {
        const searchFilter = getSearchFilter('firstVal, fortx');
        const result = searchFilter(['first word', 'third word', 'second, forth']);
        expect(result).toBeFalsy();
    });
});
