import { IxSet } from '../IxSet';

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

describe('db - IxSet', () => {
    describe('Small data set', () => {
        it('Can put some values', () => {
            const set = blankSet.with([bob, alice]);
            expect(set.byId(1).name).toBe(alice.name);
        });

        it('Can get byId', () => {
            expect(smallSet.byId(2).name).toBe(bob.name);
        });

        it('Can find by department ID', () => {
            const result = smallSet.query({ filter: { departmentId: 1 } });
            expect(result.length).toEqual(5);
        });

        it('Can find Alice by name', () => {
            expect(smallSet.query({ filter: { name: alice.name } })).toEqual([alice]);
        });

        it('Can add John and find him', () => {
            const updated = smallSet.with([john]);
            const result = updated.query({ filter: { name: john.name } });
            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(john);
        });

        it('Can find by Name and DepartmentId', () => {
            expect(smallSet.query({ filter: { name: bob.name, departmentId: bob.departmentId } })).toEqual([bob]);
        });
    });
});
