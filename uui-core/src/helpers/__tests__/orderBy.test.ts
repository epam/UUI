import { orderBy } from '../orderBy';

const data = [
    { id: 0, name: 'Name A', order: null },
    { id: 1, name: 'Name C' },
    { id: 2, name: 'Name B', order: null },
    { id: 3, name: 'Name E' },
    { id: 4, name: 'Name D', order: null },
    { id: 5, name: 'Name G' },
    { id: 6, name: 'Name F' },
    { id: 7, name: 'Name I', order: null },
    { id: 8, name: 'Name H' },
];

describe('orderBy', () => {
    it('should order data ascending by default', () => {
        expect(orderBy(data, (i) => i.name)).toEqual([
            { id: 0, name: 'Name A', order: null },
            { id: 2, name: 'Name B', order: null },
            { id: 1, name: 'Name C' },
            { id: 4, name: 'Name D', order: null },
            { id: 3, name: 'Name E' },
            { id: 6, name: 'Name F' },
            { id: 5, name: 'Name G' },
            { id: 8, name: 'Name H' },
            { id: 7, name: 'Name I', order: null },
        ]);
    });

    it('should order data ascending', () => {
        expect(orderBy(data, (i) => i.name, 'asc')).toEqual([
            { id: 0, name: 'Name A', order: null },
            { id: 2, name: 'Name B', order: null },
            { id: 1, name: 'Name C' },
            { id: 4, name: 'Name D', order: null },
            { id: 3, name: 'Name E' },
            { id: 6, name: 'Name F' },
            { id: 5, name: 'Name G' },
            { id: 8, name: 'Name H' },
            { id: 7, name: 'Name I', order: null },
        ]);
    });

    it('should order data descending', () => {
        expect(orderBy(data, (i) => i.name, 'desc')).toEqual([
            { id: 7, name: 'Name I', order: null },
            { id: 8, name: 'Name H' },
            { id: 5, name: 'Name G' },
            { id: 6, name: 'Name F' },
            { id: 3, name: 'Name E' },
            { id: 4, name: 'Name D', order: null },
            { id: 1, name: 'Name C' },
            { id: 2, name: 'Name B', order: null },
            { id: 0, name: 'Name A', order: null },
        ]);
    });

    it('should save order if order criteria is null', () => {
        const orderOnlyWithNull = data.filter(({ order }) => order === null);

        expect(orderBy(orderOnlyWithNull, (i) => i.order)).toEqual(orderOnlyWithNull);
        expect(orderBy(orderOnlyWithNull, (i) => i.order, 'asc')).toEqual(orderOnlyWithNull);
        expect(orderBy(orderOnlyWithNull, (i) => i.order, 'desc')).toEqual(orderOnlyWithNull);
    });

    it('should order correctly, if some criterias are null', () => {
        expect(orderBy(data, (i) => i.order === null ? i.order : i.name)).toEqual([
            { id: 0, name: 'Name A', order: null },
            { id: 2, name: 'Name B', order: null },
            { id: 4, name: 'Name D', order: null },
            { id: 7, name: 'Name I', order: null },
            { id: 1, name: 'Name C' },
            { id: 3, name: 'Name E' },
            { id: 6, name: 'Name F' },
            { id: 5, name: 'Name G' },
            { id: 8, name: 'Name H' },
        ]);
        expect(orderBy(data, (i) => i.order === null ? i.order : i.name, 'asc')).toEqual([
            { id: 0, name: 'Name A', order: null },
            { id: 2, name: 'Name B', order: null },
            { id: 4, name: 'Name D', order: null },
            { id: 7, name: 'Name I', order: null },
            { id: 1, name: 'Name C' },
            { id: 3, name: 'Name E' },
            { id: 6, name: 'Name F' },
            { id: 5, name: 'Name G' },
            { id: 8, name: 'Name H' },
        ]);
        expect(orderBy(data, (i) => i.order === null ? i.order : i.name, 'desc')).toEqual([
            { id: 8, name: 'Name H' },
            { id: 5, name: 'Name G' },
            { id: 6, name: 'Name F' },
            { id: 3, name: 'Name E' },
            { id: 1, name: 'Name C' },
            { id: 0, name: 'Name A', order: null },
            { id: 2, name: 'Name B', order: null },
            { id: 4, name: 'Name D', order: null },
            { id: 7, name: 'Name I', order: null },
        ]);
    });
});
