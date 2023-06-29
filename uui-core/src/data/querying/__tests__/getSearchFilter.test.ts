import { getSearchFilter } from '../getSearchFilter';

describe('getSearchFilter', () => {
    it('should return matching results', () => {
        const searchFilter = getSearchFilter('John Smith');

        expect(searchFilter(['John', 'Smith'])).toEqual(6);
        expect(searchFilter(['Johny', 'Smith'])).toEqual(5);
        expect(searchFilter(['Johny', 'Smitherman'])).toEqual(4);
        expect(searchFilter(['Rejohn', 'Smitherman'])).toEqual(3);
        expect(searchFilter(['Rejohn', 'Blacksmith'])).toEqual(2);
        expect(searchFilter(['Smithy', 'Blacksmith John'])).toEqual(3);
    });

    it('should return false if some word was not found', () => {
        const searchFilter = getSearchFilter('first fortx');
        const result = searchFilter(['first word', 'third word', 'second, forth']);
        expect(result).toBeFalsy();
    });
});
