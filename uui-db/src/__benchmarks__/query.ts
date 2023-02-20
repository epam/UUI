import * as b from 'benny';
import * as I from 'immutable';
import BTree from 'sorted-btree';
import orderBy from 'lodash.orderby';
import sortBy from 'lodash.sortby';
import range from 'lodash.range';
import { Person, blankIxSet, blankIxSetNoIndex } from './testData';
import { getFilterPredicate, getOrderComparer } from '@epam/uui-core';
import { string } from 'prop-types';
import { DbTable } from '..';

[1e1, 1e2, 1e3, 1e4, 1e5].forEach(size => {
    const testPersons = range(0, size).map(id => ({ id, name: `Person ${id}`, departmentId: Math.floor((Math.random() * size) / 10) }));
    const pairs = testPersons.map(p => [p.id, p] as [number, Person]);
    const person = testPersons[0];
    const filterPredicate = getFilterPredicate<Person>({ departmentId: 5 });
    const orderComparer = getOrderComparer<Person>([{ field: 'name' }]);

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
        `Find N entities in ${size} dataset by departmentId, sorted by name`,

        b.add('Array - scan', () => {
            return () =>
                orderBy(
                    testPersons.filter(p => p.departmentId == 5),
                    'name'
                );
        }),

        b.add('Array - with filterPredicate/orderComparer', () => {
            return () => testPersons.filter(filterPredicate).sort(orderComparer);
        }),

        b.add('BTree - toArray/scan', () => {
            const set = new BTree(pairs);
            return () => set.valuesArray().filter(filterPredicate).sort(orderComparer);
        }),

        b.add('I.Map - iterable.filter.sort, then toArray', () => {
            const set = I.Map(pairs);
            return () => (set as I.Iterable<number, Person>).filter(filterPredicate).sort(orderComparer).toArray();
        }),

        b.add('I.Map - toArray, then filter/sort', () => {
            const set = I.Map(pairs);
            return () => sortBy((set as I.Iterable<number, Person>).toArray().filter(filterPredicate), 'name');
        }),

        // Super-fast by design, probably the best way to go with indexes.
        // Skip for now to compare others.
        //
        // b.add('Lookup by I.Map with BTrees', () => {
        //     const byDepId = I.Map<number, BTree<string, Person>>();
        //     testPersons.forEach((p) => {
        //         let bTree = byDepId.get(p.departmentId);
        //         if (!bTree) {
        //             bTree = new BTree<string, Person>();
        //             byDepId.set(p.departmentId, bTree);
        //         }
        //         bTree.set(p.name, p);
        //     });
        //     const set = new BTree(pairs);
        //     return () => byDepId.get(5);
        // }),

        b.add('IxSet - with indexes', () => {
            const set = blankIxSet.with(testPersons);
            return () => set.query({ filter: { departmentId: 5 }, sorting: [{ field: 'name' }] });
        }),

        b.add('IxSet - no indexes', () => {
            const set = blankIxSetNoIndex.with(testPersons);
            return () => set.query({ filter: { departmentId: 5 }, sorting: [{ field: 'name' }] });
        }),

        b.add('DbTable - no index', () => {
            const set = personTableNoIndex.with(testPersons);
            return () => personTableNoIndex.find({ departmentId: 5 }).orderBy('name');
        }),

        b.add('DbTable - with index', () => {
            const set = personTableWithIndex.with(testPersons);
            return () => personTableWithIndex.find({ departmentId: 5 }).orderBy('name');
        }),

        b.cycle(),
        b.complete(),
        b.save({ file: `query-${size}`, version: '1.0.0' })
    );
});
