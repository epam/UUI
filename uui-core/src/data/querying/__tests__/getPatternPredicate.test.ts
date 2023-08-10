import { getFilterPredicate } from '../getFilterPredicate';
import { DataQueryFilter } from '../../../types';

interface Person {
    name: string;
    departmentId: number;
    age?: number;
}

const alice = { name: 'Alice', departmentId: 1, age: 25 } as Person;
const bob = { name: 'Bob', departmentId: 1, age: 30 } as Person;
const edward = { name: 'Edward', departmentId: 1, age: 40 } as Person;
const jack = { name: 'Jack', departmentId: 2, age: null } as Person;
const pete = { name: 'Pete', departmentId: 3, age: 45 } as Person;
const sandra = { name: 'Sandra', departmentId: 3, age: 35 } as Person;
const william = { name: 'William', departmentId: 4 } as Person;

const persons = [
    alice, bob, edward, jack, pete, sandra, william,
];

const run = (filter: DataQueryFilter<Person>) => {
    const filterPredicate = getFilterPredicate(filter as any);
    return persons.filter(filterPredicate);
};

describe('getPatternPredicate', () => {
    it('{ age: 40 }', () => {
        expect(run({ age: 40 })).toEqual([edward]);
    });

    it('{ name: "Alice" }', () => {
        expect(run({ name: 'Alice' })).toEqual([alice]);
    });

    it('{ name: "Alice", age: 25 }', () => {
        expect(run({ name: 'Alice', age: 25 })).toEqual([alice]);
    });

    it('{ name: "Alice", age: 30 }', () => {
        expect(run({ name: 'Alice', age: 30 })).toEqual([]);
    });

    it('{ age: { in: [25, 30] } }', () => {
        expect(run({ age: { in: [25, 30] } })).toEqual([alice, bob]);
    });

    it('{ departmentId: { in: [3, 4] } }', () => {
        expect(run({ departmentId: { in: [3, 4] } })).toEqual([
            pete, sandra, william,
        ]);
    });

    it('{ name: { in: ["Jack", "Pete"] }, departmentId: { in: [1, 2]} }', () => {
        expect(run({ name: { in: ['Jack', 'Pete'] }, departmentId: { in: [1, 2] } })).toEqual([jack]);
    });

    it('{ name: { in: ["Jack", "Pete"] } }', () => {
        expect(run({ name: { in: ['Jack', 'Pete'] } })).toEqual([jack, pete]);
    });

    it('{ age: { isNull: true } }', () => {
        expect(run({ age: { isNull: true } })).toEqual([jack, william]);
    });

    it('{ age: { isNull: false } }', () => {
        expect(run({ age: { isNull: false } })).toEqual([
            alice, bob, edward, pete, sandra,
        ]);
    });

    it('{ age: { gte: 40 } }', () => {
        // Should include null values as well, filter non-null values with explicit isNull: false
        expect(run({ age: { gte: 40 } })).toEqual([
            edward, jack, pete, william,
        ]);
    });

    it('{ age: { gte: 40, isNull: false } }', () => {
        // Should include null values as well, filter non-null values with explicit isNull: false
        expect(run({ age: { gte: 40, isNull: false } })).toEqual([edward, pete]);
    });

    it('{ age: { lte: 30 } }', () => {
        expect(run({ age: { lte: 30 } })).toEqual([
            alice, bob, jack, william,
        ]);
    });

    it('{ age: { lte: 30, isNull: false } }', () => {
        expect(run({ age: { lte: 30, isNull: false } })).toEqual([alice, bob]);
    });

    it('{ age: { gt: 40, isNull: false } }', () => {
        expect(run({ age: { gt: 40, isNull: false } })).toEqual([pete]);
    });

    it('{ age: { gt: 45 } }', () => {
        expect(run({ age: { gt: 45, isNull: true } })).toEqual([jack, william]);
    });

    it('{ age: { lt: 40, isNull: false }}', () => {
        expect(run({ age: { lt: 40, isNull: false } })).toEqual([
            alice, bob, sandra,
        ]);
    });

    it('{ name: { lte: "Bob" } }', () => {
        expect(run({ name: { lte: 'Bob' } })).toEqual([alice, bob]);
    });

    it('{ name: { gt: "Pete" } }', () => {
        expect(run({ name: { gt: 'Pete' } })).toEqual([sandra, william]);
    });

    it('{ departmentId: { in: [3, 4] }, age: { gt: 40 } }', () => {
        expect(run({ departmentId: { in: [3, 4] }, age: { gt: 40 } })).toEqual([pete, william]);
    });

    it('{ departmentId: { in: [3, 4] }, age: { gt: 40, isNull: false } }', () => {
        expect(run({ departmentId: { in: [3, 4] }, age: { gt: 40, isNull: false } })).toEqual([pete]);
    });

    it('{ age: { in: [null, 40] } }', () => {
        expect(run({
            age: {
                in: [
                    undefined, null, 40,
                ],
            },
        })).toEqual([
            edward, jack, william,
        ]);
    });

    it('{ age: { in: [null, "40" as any] } }', () => {
        expect(run({ age: { in: [null, '40' as any] } })).toEqual([jack]);
    });
});
