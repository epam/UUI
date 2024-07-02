import { SortingOption } from '../../../types';
import { getOrderComparer } from '../getOrderComparer';

interface Person {
    id: number;
    name: string;
    departmentId?: number | null;
    birthday?: Date;
}

const alice = {
    id: 1, name: 'Alice', departmentId: 3, birthday: new Date(2000, 1, 1),
} as Person;
const bob = {
    id: 2, name: 'Bob', departmentId: 2, birthday: new Date(1980, 4, 3),
} as Person;
const edward = {
    id: 3, name: 'Edward', departmentId: 1, birthday: new Date(1990, 2, 5),
} as Person;
const jack = {
    id: 4, name: 'Jack', departmentId: null, birthday: new Date(1995, 4, 3),
} as Person;
const pete = {
    id: 5, name: 'Pete', departmentId: 1, birthday: new Date(1970, 10, 20),
} as Person;
const sandra = {
    id: 6, name: 'Sandra', departmentId: 2, birthday: new Date(2000, 11, 30),
} as Person;
const william = { id: 7, name: 'William' } as Person;

const persons = [
    alice, bob, edward, jack, pete, sandra, william,
];

const run = (sorting: SortingOption<Person>[]) => {
    const comparer = getOrderComparer<Person, number>({ sorting, getId: ({ id }) => id });
    const sorted = [...persons].sort(comparer);
    return sorted;
};

describe('getPatternPredicate', () => {
    it('by name', () => {
        expect(run([{ field: 'name' }])).toEqual(persons);
    });

    it('by name desc', () => {
        expect(run([{ field: 'name', direction: 'desc' }])).toEqual(persons.reverse());
    });

    it('by birthday', () => {
        expect(run([{ field: 'birthday' }])).toEqual([
            william, pete, bob, edward, jack, alice, sandra,
        ]);
    });

    it('by birthday desc', () => {
        expect(run([{ field: 'birthday', direction: 'desc' }])).toEqual([
            sandra, alice, jack, edward, bob, pete, william,
        ]);
    });

    it('by departmentId, then by name', () => {
        // Null and undefined should be treated as equal
        expect(run([{ field: 'departmentId' }, { field: 'name' }])).toEqual([
            jack, william, edward, pete, bob, sandra, alice,
        ]);
    });

    it('by departmentId desc, then by name', () => {
        expect(run([{ field: 'departmentId', direction: 'desc' }, { field: 'name' }])).toEqual([
            alice, bob, sandra, edward, pete, jack, william,
        ]);
    });
});
