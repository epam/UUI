import * as b from 'benny';
import * as I from 'immutable';
import BTree from 'sorted-btree';
import { Person, blankIxSet } from './testData';
import { range } from '@epam/uui-core';
import { DbTable } from '..';

[
    1e1, 1e2, 1e3, 1e4, 1e5, 1e6,
].forEach((size) => {
    const testPersons = range(0, size).map((id) => ({ id, name: `Person ${id}`, departmentId: Math.floor(Math.random() * 10) }));
    const pairs = testPersons.map((p) => [p.id, p] as [number, Person]);
    const person = testPersons[0];

    const personTableNoIndex = new DbTable<any, any, any>({
        primaryKey: ['id'],
        tableName: 'persons',
        typeName: 'person',
    });

    const personTableWithIndex = new DbTable<any, any, any>({
        primaryKey: ['id'],
        tableName: 'persons',
        typeName: 'person',
        indexes: ['departmentId'],
    });

    b.suite(
        `Update 1 entity in ${size} dataset`,

        b.add('BTree - with()', () => {
            const set = new BTree(pairs);
            return () => set.with(5, person);
        }),

        b.add('Map - clone with Map(previous)', () => {
            const map = new Map(pairs);
            return () => {
                const m = new Map(map);
                m.set(5, person);
            };
        }),

        b.add('hash - spread clone', () => {
            const map = (Object as any).fromEntries(pairs);
            return () => {
                const newMap = { ...map, 5: person };
            };
        }),

        b.add('I.Map.set(id)', () => {
            const map = I.Map(pairs);
            return () => map.set(5, person);
        }),

        b.add('DbTable - no index', () => {
            const table = personTableNoIndex.with(testPersons);
            return () => table.with([person]);
        }),

        b.add('DbTable - single index', () => {
            const table = personTableWithIndex.with(testPersons);
            return () => table.with([person]);
        }),

        b.add('IxSet (with two indexes)', () => {
            const set = blankIxSet.with(testPersons);
            return () => set.with([person]);
        }),

        b.cycle(),
        b.complete(),
        b.save({ file: `pkUpdate-${size}`, version: '1.0.0' }),
    );
});
