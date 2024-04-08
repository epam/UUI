import { IxSet } from '../IxSet';
import { orderBy, range } from '@epam/uui-core';

interface Person {
    id: number;
    name: string;
    departmentId: number;
    location?: string;
}

const alice = {
    id: 1, name: 'Alice', departmentId: 1, location: 'UK',
} as Person;
const bob = {
    id: 2, name: 'Bob', departmentId: 1, location: 'UK',
} as Person;
const sandra = {
    id: 3, name: 'Sandra', departmentId: 1, location: 'UK',
} as Person;
const edward = {
    id: 4, name: 'Edward', departmentId: 1, location: 'UK',
} as Person;
const pete = {
    id: 5, name: 'Pete', departmentId: 1, location: 'US',
} as Person;
const jack = {
    id: 6, name: 'Jack', departmentId: 2, location: 'UK',
} as Person;
const william = {
    id: 7, name: 'William', departmentId: 2, location: 'US',
} as Person;

const john = {
    id: 8, name: 'John', departmentId: 1, location: 'US',
} as Person;

const blankSet = new IxSet<Person, number>((i) => i.id, [{ fields: ['name'] }, { fields: ['departmentId', 'name'] }]);

const smallSet = blankSet.with([
    alice, bob, sandra, edward, pete, jack, william,
]);

describe.skip('db - IxSet Performance', () => {
    let hugeSet = smallSet;
    let test100Persons: Person[];
    let test1KPersons: Person[];
    let test10KPersons: Person[];
    let test100KPersons: Person[];
    let completeTestSetInArray: Person[];

    // let test1MPersons: Person[];

    // Generating and loading data is split into separate tests to see timing in JEST logs
    it('Can generate huge data set', () => {
        test100Persons = range(10, 110).map((id) => ({ id, name: 'Just Person', departmentId: 2 }));
        test1KPersons = range(110, 1110).map((id) => ({ id, name: `Person ${id}`, departmentId: 3 }));
        test10KPersons = range(1110, 11110).map((id) => ({ id, name: `Person ${id}`, departmentId: 3 }));
        test100KPersons = range(111110).map((id) => ({ id, name: `Person ${id}`, departmentId: 3 }));
        // test1MPersons = range(200000, 1200000).map((id) => ({ id, name: 'Person ' + id, departmentId: 4 }));

        completeTestSetInArray = [
            ...smallSet.query({}), ...test100Persons, ...test1KPersons, ...test10KPersons, ...test100KPersons,
        ];
    });

    it('Can load 100 Persons', () => {
        hugeSet = hugeSet.with(test100Persons);
    });
    it('Can load 1K Persons', () => {
        hugeSet = hugeSet.with(test1KPersons);
    });
    it('Can load 10K Persons', () => {
        hugeSet = hugeSet.with(test10KPersons);
    });
    it('Can load 100K Persons', () => {
        hugeSet = hugeSet.with(test100KPersons);
    });
    // it("Can load 1M Persons", () => { hugeSet = hugeSet.with(test1MPersons); });

    [
        200, 1000, 100000, 111109,
    ].forEach((id) => {
        it(`Can find Person ${id} by name`, () => {
            const result = hugeSet.queryOne({ filter: { name: `Person ${id}` } });
            expect(result.id).toEqual(id);
        });
    });

    it("Can find all 'Just Person' people", () => {
        const result = hugeSet.query({ filter: { name: 'Just Person' } });
        expect(result.length).toEqual(100);
        expect(result[54].name).toEqual('Just Person');
    });

    it('Can find by DepartmentId sorted by name', () => {
        expect(
            hugeSet.query({
                filter: { departmentId: 1 },
                sorting: [{ field: 'name' }],
            }),
        ).toEqual([
            alice, bob, edward, pete, sandra,
        ]);
    });

    it('Can find by DepartmentId sorted by name  - with basic array', () => {
        let result = completeTestSetInArray.filter((p) => p.departmentId === 1);
        result = orderBy(result, 'name');
        expect(result).toEqual([
            alice, bob, edward, pete, sandra,
        ]);
    });

    it('Can find by location and sort by name', () => {
        expect(
            hugeSet.query({
                filter: { location: 'US' },
                sorting: [{ field: 'name' }],
            }),
        ).toEqual([pete, william]);
    });

    it('Find by location and sort by name - with basic array', () => {
        let result = completeTestSetInArray.filter((p) => p.location == 'US');
        result = orderBy(result, 'name');
        expect(result).toEqual([pete, william]);
    });
});
